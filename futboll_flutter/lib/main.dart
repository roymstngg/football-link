import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'services/auth_service.dart';
import 'services/socket_service.dart';
import 'screens/login_screen.dart';
import 'screens/lobby_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const FootballLinkApp());
}

class FootballLinkApp extends StatelessWidget {
  const FootballLinkApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthService()),
        ChangeNotifierProvider(create: (_) => SocketService()),
      ],
      child: Consumer<AuthService>(
        builder: (context, auth, _) {
          return MaterialApp(
            title: 'Football Link',
            debugShowCheckedModeBanner: false,
            theme: ThemeData(
              brightness: Brightness.dark,
              scaffoldBackgroundColor: const Color(0xFF050811),
              colorScheme: const ColorScheme.dark(
                primary: Color(0xFF38BDF8),
                secondary: Color(0xFF10B981),
                surface: Color(0xFF0B101D),
              ),
              textTheme: GoogleFonts.plusJakartaSansTextTheme(
                ThemeData.dark().textTheme,
              ),
            ),
            home: auth.isAuthenticated ? const LobbyScreen() : const LoginScreen(),
          );
        },
      ),
    );
  }
}
