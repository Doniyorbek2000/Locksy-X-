import 'package:flutter/material.dart';

class AppTheme {
  // Premium Cyber Security Theme
  static const Color primaryColor = Color(0xFF00E676); // Hacker Green
  static const Color secondaryColor = Color(0xFF00B0FF); // Cyber Blue
  static const Color backgroundColorDark = Color(0xFF0A0E17); // Very deep navy/black
  static const Color surfaceColor = Color(0xFF131A28); // Slightly lighter for cards
  static const Color textColorDark = Color(0xFFFFFFFF); // White
  static const Color textColorMuted = Color(0xFF94A3B8); // Slate 400

  // Biz asosan Dark Theme ishlatamiz (Cybersecurity style)
  static ThemeData get lightTheme => darkTheme; 

  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      primaryColor: primaryColor,
      scaffoldBackgroundColor: backgroundColorDark,
      colorScheme: const ColorScheme.dark(
        primary: primaryColor,
        secondary: secondaryColor,
        surface: surfaceColor,
        background: backgroundColorDark,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: backgroundColorDark,
        elevation: 0,
        centerTitle: true,
        iconTheme: IconThemeData(color: textColorDark),
        titleTextStyle: TextStyle(
          color: textColorDark,
          fontSize: 20,
          fontWeight: FontWeight.bold,
          letterSpacing: 1.2,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryColor,
          foregroundColor: Colors.black, // Dark text on bright green button
          minimumSize: const Size(double.infinity, 54),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            letterSpacing: 1.0,
          ),
          elevation: 8,
          shadowColor: primaryColor.withOpacity(0.5),
        ),
      ),
      cardTheme: CardThemeData(
        color: surfaceColor,
        elevation: 4,
        shadowColor: Colors.black.withOpacity(0.5),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: Color(0xFF233045), width: 1),
        ),
      ),
      textTheme: const TextTheme(
        bodyLarge: TextStyle(color: textColorDark),
        bodyMedium: TextStyle(color: textColorMuted),
        titleLarge: TextStyle(color: textColorDark, fontWeight: FontWeight.bold),
      ),
    );
  }
}
