class UserModel {
  final String id;
  final String displayName;
  final String email;
  final String avatarUrl;
  final int wins;
  final int losses;
  final int rating;
  final bool isGuest;

  UserModel({
    required this.id,
    required this.displayName,
    required this.email,
    required this.avatarUrl,
    this.wins = 0,
    this.losses = 0,
    this.rating = 1000,
    this.isGuest = false,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? '',
      displayName: json['displayName'] ?? json['username'] ?? 'Oyuncu',
      email: json['email'] ?? '',
      avatarUrl: json['avatarUrl'] ?? '',
      wins: json['wins'] ?? 0,
      losses: json['losses'] ?? 0,
      rating: json['rating'] ?? 1000,
      isGuest: json['isGuest'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'displayName': displayName,
      'email': email,
      'avatarUrl': avatarUrl,
      'wins': wins,
      'losses': losses,
      'rating': rating,
      'isGuest': isGuest,
    };
  }
}
