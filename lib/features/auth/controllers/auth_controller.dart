import 'dart:convert';
import 'package:crypto/crypto.dart';
import 'package:get/get.dart';
import 'package:locksy_x/core/services/auth_service.dart';
import 'package:locksy_x/core/services/secure_storage_service.dart';
import 'package:locksy_x/routes/app_pages.dart';

class AuthController extends GetxController {
  final AuthService _authService = Get.find<AuthService>();
  final SecureStorageService _storageService = Get.find<SecureStorageService>();

  var isAuthenticating = false.obs;
  var enteredPin = ''.obs;
  var errorMessage = ''.obs;

  @override
  void onReady() {
    super.onReady();
    _checkInitialState();
  }

  Future<void> _checkInitialState() async {
    // Agar foydalanuvchi avval ro'yxatdan o'tmagan bo'lsa (PIN o'rnatmagan bo'lsa)
    String? pinHash = await _storageService.readData('master_pin_hash');
    if (pinHash == null || pinHash.isEmpty) {
      Get.offAllNamed(AppRoutes.SETUP_PIN);
    } else {
      // Biometriyani avtomatik so'rash (ixtiyoriy, lekin qulaylik uchun yaxshi)
      authenticateBiometric();
    }
  }

  void addDigit(String digit) {
    if (errorMessage.value.isNotEmpty) errorMessage.value = '';
    
    if (enteredPin.value.length < 4) {
      enteredPin.value += digit;
      if (enteredPin.value.length == 4) {
        _verifyPin();
      }
    }
  }

  void removeDigit() {
    if (errorMessage.value.isNotEmpty) errorMessage.value = '';
    if (enteredPin.value.isNotEmpty) {
      enteredPin.value = enteredPin.value.substring(0, enteredPin.value.length - 1);
    }
  }

  Future<void> _verifyPin() async {
    String? savedHash = await _storageService.readData('master_pin_hash');
    if (savedHash == null) return;

    final bytes = utf8.encode(enteredPin.value + 'locksy_salt_2026');
    final digest = sha256.convert(bytes);

    if (digest.toString() == savedHash) {
      enteredPin.value = '';
      Get.offAllNamed(AppRoutes.HOME);
    } else {
      errorMessage.value = 'Noto\'g\'ri PIN kod';
      enteredPin.value = '';
    }
  }

  Future<void> authenticateBiometric() async {
    isAuthenticating.value = true;
    try {
      bool success = await _authService.authenticate();
      if (success) {
        enteredPin.value = '';
        Get.offAllNamed(AppRoutes.HOME);
      }
    } finally {
      isAuthenticating.value = false;
    }
  }
}
