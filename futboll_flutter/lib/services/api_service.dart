import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;

class ApiService {
  // Default to 10.0.2.2 for Android Emulator, or localhost / local IP
  static String baseUrl = 'http://10.0.2.2:3000/api/game';

  static void setCustomHost(String host) {
    baseUrl = 'http://$host:3000/api/game';
  }

  /// GET /api/game/random-pair
  static Future<Map<String, dynamic>?> getRandomPair() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/random-pair'));
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
    } catch (e) {
      if (kDebugMode) print('Error fetching random pair: $e');
    }
    return null;
  }

  /// GET /api/game/custom-pair?teamAId=...&teamBId=...
  static Future<Map<String, dynamic>?> getCustomPair(String teamAId, [String? teamBId]) async {
    try {
      final url = Uri.parse('$baseUrl/custom-pair').replace(queryParameters: {
        'teamAId': teamAId,
        if (teamBId != null) 'teamBId': teamBId,
      });
      final response = await http.get(url);
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
    } catch (e) {
      if (kDebugMode) print('Error fetching custom pair: $e');
    }
    return null;
  }

  /// POST /api/game/verify-answer
  static Future<Map<String, dynamic>> verifyAnswer({
    required String teamAId,
    required String teamBId,
    required String playerInput,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/verify-answer'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'teamAId': teamAId,
          'teamBId': teamBId,
          'playerInput': playerInput,
        }),
      );
      if (response.statusCode == 200 || response.statusCode == 201) {
        return jsonDecode(response.body);
      }
    } catch (e) {
      if (kDebugMode) print('Error verifying answer: $e');
    }
    return {
      'success': false,
      'message': 'Sunucuya bağlanılamadı. Lütfen backend sunucunuzun (localhost:3000) açık olduğundan emin olun.',
    };
  }

  /// GET /api/game/tictactoe-grid
  static Future<Map<String, dynamic>?> getTicTacToeGrid() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/tictactoe-grid'));
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
    } catch (e) {
      if (kDebugMode) print('Error fetching TicTacToe grid: $e');
    }
    return null;
  }

  /// GET /api/game/search-teams?query=...
  static Future<List<dynamic>> searchTeams(String query) async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/search-teams?query=$query'));
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
    } catch (e) {
      if (kDebugMode) print('Error searching teams: $e');
    }
    return [];
  }

  /// GET /api/game/explore-players?query=...
  static Future<List<dynamic>> explorePlayers(String query) async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/explore-players?query=$query'));
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
    } catch (e) {
      if (kDebugMode) print('Error exploring players: $e');
    }
    return [];
  }
}
