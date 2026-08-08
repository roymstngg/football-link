import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;

class SocketService with ChangeNotifier {
  IO.Socket? _socket;
  bool _isConnected = false;
  String _serverUrl = 'http://192.168.1.108:3000';
  
  String? _currentRoomId;
  String? _roomCode;
  String? _statusMessage;
  
  // Game states
  bool _inQueue = false;
  Map<String, dynamic>? _matchData;
  Map<String, dynamic>? _tttData;
  List<dynamic> _historyFeed = [];
  Map<String, dynamic>? _scores;
  String? _winnerName;

  bool get isConnected => _isConnected;
  String get serverUrl => _serverUrl;
  String? get currentRoomId => _currentRoomId;
  String? get roomCode => _roomCode;
  String? get statusMessage => _statusMessage;
  bool get inQueue => _inQueue;
  Map<String, dynamic>? get matchData => _matchData;
  Map<String, dynamic>? get tttData => _tttData;
  List<dynamic> get historyFeed => _historyFeed;
  Map<String, dynamic>? get scores => _scores;
  String? get winnerName => _winnerName;

  SocketService() {
    _loadSavedServerUrl();
  }

  Future<void> _loadSavedServerUrl() async {
    final prefs = await SharedPreferences.getInstance();
    final saved = prefs.getString('football_link_server_url');
    if (saved != null && saved.isNotEmpty) {
      _serverUrl = saved;
      notifyListeners();
    }
  }

  Future<void> setServerUrl(String url) async {
    String cleanUrl = url.trim();
    if (cleanUrl.isEmpty) return;
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://$cleanUrl';
    }
    if (cleanUrl.endsWith('/')) {
      cleanUrl = cleanUrl.substring(0, cleanUrl.length - 1);
    }
    
    _serverUrl = cleanUrl;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('football_link_server_url', _serverUrl);
    
    disconnect();
    connectToServer();
  }

  void connectToServer() {
    if (_socket != null && _socket!.connected) return;

    _socket = IO.io(
      _serverUrl,
      IO.OptionBuilder()
          .setTransports(['websocket', 'polling'])
          .disableAutoConnect()
          .build(),
    );

    _socket!.connect();

    _socket!.onConnect((_) {
      _isConnected = true;
      _statusMessage = 'Sunucuya Bağlandı';
      if (kDebugMode) print('⚡ Socket connected to $_serverUrl');
      notifyListeners();
    });

    _socket!.onDisconnect((_) {
      _isConnected = false;
      _statusMessage = 'Sunucu Bağlantısı Kopuk';
      if (kDebugMode) print('❌ Socket disconnected');
      notifyListeners();
    });

    _socket!.on('queueStatus', (data) {
      if (data is Map) {
        _inQueue = data['inQueue'] ?? false;
        notifyListeners();
      }
    });

    _socket!.on('privateRoomCreated', (data) {
      if (data is Map) {
        _currentRoomId = data['roomId'];
        _roomCode = data['roomCode'];
        _statusMessage = data['message'];
        notifyListeners();
      }
    });

    _socket!.on('privateRoomError', (data) {
      if (data is Map) {
        _statusMessage = data['message'];
        notifyListeners();
      }
    });

    _socket!.on('matchFound', (data) {
      if (data is Map) {
        _inQueue = false;
        _currentRoomId = data['roomId'];
        _matchData = Map<String, dynamic>.from(data);
        _historyFeed.clear();
        notifyListeners();
      }
    });

    _socket!.on('matchStartedWithTeams', (data) {
      if (data is Map) {
        _matchData = Map<String, dynamic>.from(data);
        notifyListeners();
      }
    });

    _socket!.on('answerResult', (data) {
      if (data is Map) {
        _historyFeed.add(data);
        if (data.containsKey('scores')) {
          _scores = Map<String, dynamic>.from(data['scores']);
        }
        notifyListeners();
      }
    });

    _socket!.on('matchEnded', (data) {
      if (data is Map) {
        _winnerName = data['winnerName'] ?? 'Maç Bitti';
        notifyListeners();
      }
    });

    _socket!.on('ticTacToeStarted', (data) {
      if (data is Map) {
        _currentRoomId = data['roomId'];
        _tttData = Map<String, dynamic>.from(data);
        notifyListeners();
      }
    });

    _socket!.on('ticTacToeResult', (data) {
      if (data is Map) {
        if (data.containsKey('board') && _tttData != null) {
          _tttData!['board'] = data['board'];
          _tttData!['currentTurnUserId'] = data['nextTurnUserId'];
        }
        notifyListeners();
      }
    });
  }

  void joinQueue(String userId, String username) {
    _socket?.emit('joinQueue', {'userId': userId, 'username': username});
    _inQueue = true;
    notifyListeners();
  }

  void leaveQueue() {
    _socket?.emit('leaveQueue');
    _inQueue = false;
    notifyListeners();
  }

  void createPrivateRoom(String userId, String username, String gameMode) {
    _socket?.emit('createPrivateRoom', {
      'userId': userId,
      'username': username,
      'gameMode': gameMode,
    });
  }

  void joinPrivateRoom(String roomCode, String userId, String username) {
    _socket?.emit('joinPrivateRoom', {
      'roomCode': roomCode,
      'userId': userId,
      'username': username,
    });
  }

  void selectSimultaneousTeam(String roomId, String teamId) {
    _socket?.emit('selectSimultaneousTeam', {
      'roomId': roomId,
      'teamId': teamId,
    });
  }

  void submitAnswer(String roomId, String playerInput) {
    _socket?.emit('submitAnswer', {
      'roomId': roomId,
      'playerInput': playerInput,
    });
  }

  void submitTicTacToeMove(String roomId, int row, int col, String playerInput) {
    _socket?.emit('submitTicTacToeMove', {
      'roomId': roomId,
      'rowIndex': row,
      'colIndex': col,
      'playerInput': playerInput,
    });
  }

  void disconnect() {
    _socket?.disconnect();
    _socket?.dispose();
    _socket = null;
    _isConnected = false;
    notifyListeners();
  }

  @override
  void dispose() {
    disconnect();
    super.dispose();
  }
}
