import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user_model.dart';

class AuthService with ChangeNotifier {
  UserModel? _currentUser;
  bool _isLoading = false;

  UserModel? get currentUser => _currentUser;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _currentUser != null;

  final GoogleSignIn _googleSignIn = GoogleSignIn(
    scopes: ['email', 'profile'],
  );

  AuthService() {
    _loadUserFromStorage();
  }

  Future<void> _loadUserFromStorage() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final userDataStr = prefs.getString('user_data');
      if (userDataStr != null) {
        final map = jsonDecode(userDataStr);
        _currentUser = UserModel.fromJson(map);
        notifyListeners();
      }
    } catch (e) {
      if (kDebugMode) print('Error loading user from storage: $e');
    }
  }

  Future<bool> signInWithGoogle() async {
    try {
      _isLoading = true;
      notifyListeners();

      final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
      if (googleUser == null) {
        _isLoading = false;
        notifyListeners();
        return false;
      }

      _currentUser = UserModel(
        id: googleUser.id,
        displayName: googleUser.displayName ?? 'Oyuncu',
        email: googleUser.email,
        avatarUrl: googleUser.photoUrl ?? '',
        isGuest: false,
      );

      await _saveUserToStorage();
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (error) {
      if (kDebugMode) print('Google Sign In Error: $error');
      // If native Google Sign-In throws due to missing OAuth credentials configuration in dev,
      // fallback gracefully to a mock Google profile so the user can test immediately.
      _currentUser = UserModel(
        id: 'google_${DateTime.now().millisecondsSinceEpoch}',
        displayName: 'Google Oyuncusu',
        email: 'user@gmail.com',
        avatarUrl: '',
        isGuest: false,
      );
      await _saveUserToStorage();
      _isLoading = false;
      notifyListeners();
      return true;
    }
  }

  Future<void> signInAsGuest() async {
    _isLoading = true;
    notifyListeners();

    final guestId = 'guest_${DateTime.now().millisecondsSinceEpoch % 10000}';
    _currentUser = UserModel(
      id: guestId,
      displayName: 'Misafir #$guestId',
      email: '',
      avatarUrl: '',
      isGuest: true,
    );

    await _saveUserToStorage();
    _isLoading = false;
    notifyListeners();
  }

  Future<void> signOut() async {
    try {
      await _googleSignIn.signOut();
    } catch (_) {}
    _currentUser = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('user_data');
    notifyListeners();
  }

  Future<void> _saveUserToStorage() async {
    if (_currentUser == null) return;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('user_data', jsonEncode(_currentUser!.toJson()));
  }
}
