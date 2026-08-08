class PlayerDisc {
  final String id;
  final String name;
  double x;
  double y;
  double vx;
  double vy;
  final int team; // 1: Red/Host, 2: Blue/Guest
  final double radius;

  PlayerDisc({
    required this.id,
    required this.name,
    required this.x,
    required this.y,
    this.vx = 0.0,
    this.vy = 0.0,
    required this.team,
    this.radius = 22.0,
  });

  factory PlayerDisc.fromJson(Map<String, dynamic> json) {
    return PlayerDisc(
      id: json['id'] ?? '',
      name: json['name'] ?? 'Oyuncu',
      x: (json['x'] as num?)?.toDouble() ?? 0.0,
      y: (json['y'] as num?)?.toDouble() ?? 0.0,
      vx: (json['vx'] as num?)?.toDouble() ?? 0.0,
      vy: (json['vy'] as num?)?.toDouble() ?? 0.0,
      team: (json['team'] as num?)?.toInt() ?? 1,
      radius: (json['radius'] as num?)?.toDouble() ?? 22.0,
    );
  }
}

class Ball {
  double x;
  double y;
  double vx;
  double vy;
  final double radius;

  Ball({
    required this.x,
    required this.y,
    this.vx = 0.0,
    this.vy = 0.0,
    this.radius = 12.0,
  });

  factory Ball.fromJson(Map<String, dynamic> json) {
    return Ball(
      x: (json['x'] as num?)?.toDouble() ?? 400.0,
      y: (json['y'] as num?)?.toDouble() ?? 250.0,
      vx: (json['vx'] as num?)?.toDouble() ?? 0.0,
      vy: (json['vy'] as num?)?.toDouble() ?? 0.0,
      radius: (json['radius'] as num?)?.toDouble() ?? 12.0,
    );
  }
}

class RoomInfo {
  final String id;
  final String name;
  final String hostName;
  final int playerCount;
  final int maxPlayers;

  RoomInfo({
    required this.id,
    required this.name,
    required this.hostName,
    required this.playerCount,
    this.maxPlayers = 2,
  });

  factory RoomInfo.fromJson(Map<String, dynamic> json) {
    return RoomInfo(
      id: json['id'] ?? '',
      name: json['name'] ?? 'Futbol Maçı',
      hostName: json['hostName'] ?? 'Ev Sahibi',
      playerCount: json['playerCount'] ?? 1,
      maxPlayers: json['maxPlayers'] ?? 2,
    );
  }
}
