import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/api_service.dart';

class GameScreen extends StatefulWidget {
  const GameScreen({super.key});

  @override
  State<GameScreen> createState() => _GameScreenState();
}

class _GameScreenState extends State<GameScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final TextEditingController _guessController = TextEditingController();
  final TextEditingController _serverIpController = TextEditingController();

  // Matchup state from NestJS backend
  String? _teamAId;
  String _teamAName = 'Real Madrid';
  String _teamALogo = '';
  String? _teamBId;
  String _teamBName = 'Paris Saint Germain';
  String _teamBLogo = '';
  int _commonPlayerCount = 0;

  bool _isLoadingPair = false;
  bool _isSubmitting = false;

  int _score = 0;
  int _timerSeconds = 60;
  Timer? _timer;
  bool _isGameOver = false;

  List<Map<String, dynamic>> _guessHistory = [];
  List<dynamic> _playerSuggestions = [];

  // Football Tic-Tac-Toe Grid state from backend
  List<dynamic> _rowTeams = [];
  List<dynamic> _colTeams = [];
  final Map<String, String> _gridCells = {};
  bool _isLoadingGrid = false;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _fetchRandomPairFromBackend();
    _fetchTicTacToeGridFromBackend();
  }

  void _startTimer() {
    _timer?.cancel();
    _timerSeconds = 60;
    _timer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (_timerSeconds > 0) {
        setState(() => _timerSeconds--);
      } else {
        _timer?.cancel();
        setState(() => _isGameOver = true);
      }
    });
  }

  Future<void> _fetchRandomPairFromBackend() async {
    setState(() => _isLoadingPair = true);
    final data = await ApiService.getRandomPair();
    if (data != null && mounted) {
      setState(() {
        _teamAId = data['teamA']['id'];
        _teamAName = data['teamA']['name'];
        _teamALogo = data['teamA']['logo'] ?? '';

        _teamBId = data['teamB']['id'];
        _teamBName = data['teamB']['name'];
        _teamBLogo = data['teamB']['logo'] ?? '';

        _commonPlayerCount = data['commonPlayerCount'] ?? 0;
        _isLoadingPair = false;
        _isGameOver = false;
        _guessHistory.clear();
      });
      _startTimer();
    } else if (mounted) {
      setState(() => _isLoadingPair = false);
    }
  }

  Future<void> _fetchTicTacToeGridFromBackend() async {
    setState(() => _isLoadingGrid = true);
    final data = await ApiService.getTicTacToeGrid();
    if (data != null && mounted) {
      setState(() {
        _rowTeams = data['rowTeams'] ?? [];
        _colTeams = data['colTeams'] ?? [];
        _isLoadingGrid = false;
      });
    } else if (mounted) {
      setState(() => _isLoadingGrid = false);
    }
  }

  Future<void> _onSearchPlayer(String query) async {
    if (query.trim().length < 2) {
      setState(() => _playerSuggestions = []);
      return;
    }
    final results = await ApiService.explorePlayers(query);
    if (mounted) {
      setState(() => _playerSuggestions = results);
    }
  }

  Future<void> _submitGuess([String? selectedPlayerName]) async {
    final input = selectedPlayerName ?? _guessController.text.trim();
    if (input.isEmpty || _teamAId == null || _teamBId == null || _isSubmitting) return;

    setState(() {
      _isSubmitting = true;
      _playerSuggestions = [];
    });

    // Call NestJS verifyAnswer API directly
    final res = await ApiService.verifyAnswer(
      teamAId: _teamAId!,
      teamBId: _teamBId!,
      playerInput: input,
    );

    if (!mounted) return;

    final bool isSuccess = res['success'] == true;
    final String message = res['message'] ?? (isSuccess ? 'Tebrikler!' : 'Yanlış cevap');
    final int points = res['points'] ?? (isSuccess ? 10 : 0);

    setState(() {
      _isSubmitting = false;
      _guessHistory.insert(0, {
        'player': input,
        'isCorrect': isSuccess,
        'message': message,
      });
      if (isSuccess) _score += points;
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: isSuccess ? const Color(0xFF10B981) : const Color(0xFFEF4444),
        content: Row(
          children: [
            Icon(isSuccess ? Icons.check_circle : Icons.cancel, color: Colors.white),
            const SizedBox(width: 10),
            Expanded(child: Text(message, style: const TextStyle(fontWeight: FontWeight.bold))),
          ],
        ),
      ),
    );

    _guessController.clear();
  }

  void _showServerSettingsDialog() {
    _serverIpController.text = '10.0.2.2';
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF0B101D),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Text(
          'Backend (localhost:3000) Ayarları',
          style: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Android Emülatör için: 10.0.2.2\nGerçek Telefon / Yerel Ağ için: Bilgisayarınızın IP adresi (Örn: 192.168.1.50)',
              style: TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _serverIpController,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                labelText: 'Sunucu Host/IP',
                labelStyle: const TextStyle(color: Color(0xFF94A3B8)),
                enabledBorder: OutlineInputBorder(
                  borderSide: const BorderSide(color: Color(0xFF1E2A45)),
                  borderRadius: BorderRadius.circular(12),
                ),
                focusedBorder: OutlineInputBorder(
                  borderSide: const BorderSide(color: Color(0xFF38BDF8)),
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('İptal', style: TextStyle(color: Color(0xFF94A3B8))),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF38BDF8)),
            onPressed: () {
              ApiService.setCustomHost(_serverIpController.text.trim());
              Navigator.pop(ctx);
              _fetchRandomPairFromBackend();
            },
            child: const Text('Kaydet ve Yenile', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _timer?.cancel();
    _tabController.dispose();
    _guessController.dispose();
    _serverIpController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF050811),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0B101D),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Futbolcu Tahmin Arena (Localhost API)',
          style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 16),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings_ethernet, color: Color(0xFF38BDF8)),
            tooltip: 'Backend IP Ayarla',
            onPressed: _showServerSettingsDialog,
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: const Color(0xFF38BDF8),
          tabs: const [
            Tab(icon: Icon(Icons.compare_arrows), text: '2 Takım Ortak Oyuncu'),
            Tab(icon: Icon(Icons.grid_on), text: 'Football Tic-Tac-Toe'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildMatchupGuessView(),
          _buildTicTacToeView(),
        ],
      ),
    );
  }

  Widget _buildMatchupGuessView() {
    if (_isLoadingPair) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircularProgressIndicator(color: Color(0xFF38BDF8)),
            SizedBox(height: 16),
            Text('Localhost NestJS veritabanından rastgele takım çifti çekiliyor...',
                style: TextStyle(color: Color(0xFF94A3B8))),
          ],
        ),
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          // Score and Timer Bar
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                decoration: BoxDecoration(
                  color: const Color(0xFF1E2A45),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.emoji_events, color: Color(0xFFF59E0B), size: 20),
                    const SizedBox(width: 8),
                    Text('Skor: $_score',
                        style: GoogleFonts.outfit(
                            fontWeight: FontWeight.bold, fontSize: 16, color: Colors.white)),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  color: _timerSeconds < 10
                      ? const Color(0xFFEF4444).withValues(alpha: 0.2)
                      : const Color(0xFF10B981).withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: _timerSeconds < 10 ? const Color(0xFFEF4444) : const Color(0xFF10B981),
                  ),
                ),
                child: Row(
                  children: [
                    Icon(Icons.timer_outlined,
                        color: _timerSeconds < 10 ? const Color(0xFFEF4444) : const Color(0xFF10B981),
                        size: 20),
                    const SizedBox(width: 6),
                    Text(
                      '$_timerSeconds s',
                      style: GoogleFonts.outfit(
                        fontWeight: FontWeight.w900,
                        fontSize: 18,
                        color: _timerSeconds < 10 ? const Color(0xFFEF4444) : const Color(0xFF10B981),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 20),

          // Matchup Card (Takım A vs Takım B from NestJS backend)
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF0B101D), Color(0xFF131B2E)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0xFF1E2A45)),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF38BDF8).withValues(alpha: 0.1),
                  blurRadius: 20,
                ),
              ],
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    // Team A
                    Expanded(
                      child: Column(
                        children: [
                          _teamALogo.isNotEmpty
                              ? Image.network(_teamALogo, width: 54, height: 54, errorBuilder: (_, __, ___) => const Icon(Icons.shield, color: Color(0xFF38BDF8), size: 48))
                              : const Icon(Icons.shield, color: Color(0xFF38BDF8), size: 48),
                          const SizedBox(height: 8),
                          Text(
                            _teamAName,
                            textAlign: TextAlign.center,
                            maxLines: 2,
                            style: GoogleFonts.outfit(
                                fontWeight: FontWeight.bold, fontSize: 14, color: Colors.white),
                          ),
                        ],
                      ),
                    ),

                    // VS Circle
                    Container(
                      width: 42,
                      height: 42,
                      margin: const EdgeInsets.symmetric(horizontal: 8),
                      decoration: const BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: LinearGradient(
                          colors: [Color(0xFF38BDF8), Color(0xFFA855F7)],
                        ),
                      ),
                      child: const Center(
                        child: Text(
                          'VS',
                          style: TextStyle(fontWeight: FontWeight.w900, color: Colors.white, fontSize: 15),
                        ),
                      ),
                    ),

                    // Team B
                    Expanded(
                      child: Column(
                        children: [
                          _teamBLogo.isNotEmpty
                              ? Image.network(_teamBLogo, width: 54, height: 54, errorBuilder: (_, __, ___) => const Icon(Icons.shield, color: Color(0xFFA855F7), size: 48))
                              : const Icon(Icons.shield, color: Color(0xFFA855F7), size: 48),
                          const SizedBox(height: 8),
                          Text(
                            _teamBName,
                            textAlign: TextAlign.center,
                            maxLines: 2,
                            style: GoogleFonts.outfit(
                                fontWeight: FontWeight.bold, fontSize: 14, color: Colors.white),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                if (_commonPlayerCount > 0) ...[
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFF10B981).withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text(
                      'Ortak Futbolcu Sayısı: $_commonPlayerCount',
                      style: const TextStyle(color: Colors.greenAccent, fontSize: 12, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ],
            ),
          ),

          const SizedBox(height: 20),

          // Search & Autocomplete Player Input
          TextField(
            controller: _guessController,
            enabled: !_isGameOver && !_isSubmitting,
            onChanged: _onSearchPlayer,
            onSubmitted: (_) => _submitGuess(),
            style: const TextStyle(color: Colors.white, fontSize: 15),
            decoration: InputDecoration(
              hintText: 'Ortak futbolcu adını yaz (Örn: Di Maria)...',
              hintStyle: const TextStyle(color: Color(0xFF94A3B8), fontSize: 14),
              filled: true,
              fillColor: const Color(0xFF0B101D),
              suffixIcon: _isSubmitting
                  ? const Padding(
                      padding: EdgeInsets.all(12),
                      child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF38BDF8)),
                    )
                  : IconButton(
                      icon: const Icon(Icons.send, color: Color(0xFF38BDF8)),
                      onPressed: () => _submitGuess(),
                    ),
              enabledBorder: OutlineInputBorder(
                borderSide: const BorderSide(color: Color(0xFF1E2A45)),
                borderRadius: BorderRadius.circular(16),
              ),
              focusedBorder: OutlineInputBorder(
                borderSide: const BorderSide(color: Color(0xFF38BDF8), width: 2),
                borderRadius: BorderRadius.circular(16),
              ),
            ),
          ),

          // Real-time Autocomplete Suggestions from Prisma DB
          if (_playerSuggestions.isNotEmpty)
            Container(
              margin: const EdgeInsets.only(top: 6),
              constraints: const BoxConstraints(maxHeight: 180),
              decoration: BoxDecoration(
                color: const Color(0xFF0B101D),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFF38BDF8)),
              ),
              child: ListView.builder(
                shrinkWrap: true,
                itemCount: _playerSuggestions.length,
                itemBuilder: (ctx, idx) {
                  final p = _playerSuggestions[idx];
                  return ListTile(
                    dense: true,
                    title: Text(p['name'] ?? '', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                    subtitle: Text(p['nationality'] ?? '', style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 11)),
                    onTap: () {
                      _guessController.text = p['name'] ?? '';
                      _submitGuess(p['name']);
                    },
                  );
                },
              ),
            ),

          const SizedBox(height: 16),

          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF38BDF8),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  onPressed: _isSubmitting ? null : () => _submitGuess(),
                  icon: const Icon(Icons.check, color: Colors.white),
                  label: Text('Tahmini Doğrula (NestJS API)',
                      style: GoogleFonts.plusJakartaSans(
                          fontWeight: FontWeight.bold, color: Colors.white)),
                ),
              ),
              const SizedBox(width: 12),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF1E2A45),
                  padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                onPressed: _fetchRandomPairFromBackend,
                icon: const Icon(Icons.refresh, color: Colors.white),
                label: Text('Yeni Eşleşme',
                    style: GoogleFonts.plusJakartaSans(
                        fontWeight: FontWeight.bold, color: Colors.white)),
              ),
            ],
          ),

          const SizedBox(height: 24),

          // Feed History Header
          Align(
            alignment: Alignment.centerLeft,
            child: Text(
              'Tahmin Geçmişi',
              style: GoogleFonts.outfit(
                  color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
            ),
          ),
          const SizedBox(height: 10),

          // Guess History List
          _guessHistory.isEmpty
              ? Container(
                  padding: const EdgeInsets.all(20),
                  child: const Text('Henüz tahmin yapılmadı.',
                      style: TextStyle(color: Color(0xFF94A3B8))),
                )
              : ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: _guessHistory.length,
                  itemBuilder: (context, index) {
                    final item = _guessHistory[index];
                    final bool isCorrect = item['isCorrect'];
                    return Container(
                      margin: const EdgeInsets.only(bottom: 8),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: const Color(0xFF0B101D),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isCorrect ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                        ),
                      ),
                      child: Row(
                        children: [
                          Icon(
                            isCorrect ? Icons.check_circle : Icons.cancel,
                            color: isCorrect ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  item['player'],
                                  style: const TextStyle(
                                      color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
                                ),
                                Text(
                                  item['message'],
                                  style: TextStyle(
                                    color: isCorrect ? Colors.greenAccent : Colors.redAccent,
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
        ],
      ),
    );
  }

  Widget _buildTicTacToeView() {
    if (_isLoadingGrid) {
      return const Center(child: CircularProgressIndicator(color: Color(0xFF38BDF8)));
    }

    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        children: [
          Text(
            '3x3 Futbol Tic-Tac-Toe Grid (NestJS Backend)',
            style: GoogleFonts.outfit(
                color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18),
          ),
          const SizedBox(height: 6),
          Text(
            'Satır ve sütundaki 2 takımda da oynamış futbolcuyu bulup kareyi kap!',
            textAlign: TextAlign.center,
            style: GoogleFonts.plusJakartaSans(color: const Color(0xFF94A3B8), fontSize: 13),
          ),
          const SizedBox(height: 20),

          // 3x3 Grid
          Expanded(
            child: GridView.builder(
              itemCount: 16,
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 4,
                crossAxisSpacing: 8,
                mainAxisSpacing: 8,
              ),
              itemBuilder: (context, index) {
                int row = index ~/ 4;
                int col = index % 4;

                if (row == 0 && col == 0) {
                  return Container(
                    decoration: BoxDecoration(
                      color: const Color(0xFF0B101D),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(Icons.sports_soccer, color: Color(0xFF38BDF8)),
                  );
                }

                if (row == 0) {
                  final team = _colTeams.length >= col ? _colTeams[col - 1] : null;
                  return Container(
                    padding: const EdgeInsets.all(4),
                    decoration: BoxDecoration(
                      color: const Color(0xFF131B2E),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: const Color(0xFF1E2A45)),
                    ),
                    child: Center(
                      child: Text(
                        team != null ? team['name'] ?? '' : 'Takım ${col}',
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                            color: Color(0xFF38BDF8), fontWeight: FontWeight.bold, fontSize: 11),
                      ),
                    ),
                  );
                }

                if (col == 0) {
                  final team = _rowTeams.length >= row ? _rowTeams[row - 1] : null;
                  return Container(
                    padding: const EdgeInsets.all(4),
                    decoration: BoxDecoration(
                      color: const Color(0xFF131B2E),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: const Color(0xFF1E2A45)),
                    ),
                    child: Center(
                      child: Text(
                        team != null ? team['name'] ?? '' : 'Takım ${row}',
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                            color: Color(0xFFA855F7), fontWeight: FontWeight.bold, fontSize: 11),
                      ),
                    ),
                  );
                }

                final cellKey = '${row - 1}_${col - 1}';
                final answered = _gridCells[cellKey];

                return GestureDetector(
                  onTap: () {
                    final rTeam = _rowTeams.length >= row ? _rowTeams[row - 1]['name'] : 'Takım A';
                    final cTeam = _colTeams.length >= col ? _colTeams[col - 1]['name'] : 'Takım B';
                    _showGridGuessDialog('$rTeam & $cTeam', cellKey);
                  },
                  child: Container(
                    decoration: BoxDecoration(
                      color: answered != null
                          ? const Color(0xFF10B981).withValues(alpha: 0.2)
                          : const Color(0xFF0B101D),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: answered != null
                            ? const Color(0xFF10B981)
                            : const Color(0xFF1E2A45),
                      ),
                    ),
                    child: Center(
                      child: Text(
                        answered ?? '?',
                        style: TextStyle(
                          color: answered != null ? Colors.greenAccent : Colors.white54,
                          fontWeight: FontWeight.bold,
                          fontSize: 13,
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  void _showGridGuessDialog(String pairName, String cellKey) {
    final controller = TextEditingController();
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF0B101D),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Text(
          pairName,
          style: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        content: TextField(
          controller: controller,
          style: const TextStyle(color: Colors.white),
          decoration: const InputDecoration(
            hintText: 'Ortak futbolcu adı (Örn: Di Maria)...',
            hintStyle: TextStyle(color: Color(0xFF94A3B8)),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('İptal', style: TextStyle(color: Color(0xFF94A3B8))),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF10B981)),
            onPressed: () {
              if (controller.text.trim().isNotEmpty) {
                setState(() {
                  _gridCells[cellKey] = controller.text.trim();
                });
              }
              Navigator.pop(ctx);
            },
            child: const Text('Onayla', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }
}
