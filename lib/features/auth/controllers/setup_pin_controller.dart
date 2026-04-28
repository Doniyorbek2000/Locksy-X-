import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:locksy_x/core/services/security_service.dart';
import 'package:locksy_x/routes/app_pages.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SetupPinController extends GetxController {
  final _storage = const FlutterSecureStorage();
  final _securityService = Get.find<SecurityService>();

  var pin = ''.obs;
  var confirmPin = ''.obs;
  var isConfirmStep = false.obs;
  var errorMessage = ''.obs;

  void addDigit(String digit) {
    if (!isConfirmStep.value) {
      if (pin.value.length < 4) pin.value += digit;
      if (pin.value.length == 4) isConfirmStep.value = true;
    } else {
      if (confirmPin.value.length < 4) confirmPin.value += digit;
      if (confirmPin.value.length == 4) _validateAndSave();
    }
  }

  void removeDigit() {
    if (!isConfirmStep.value) {
      if (pin.value.isNotEmpty) pin.value = pin.value.substring(0, pin.value.length - 1);
    } else {
      if (confirmPin.value.isNotEmpty) {
        confirmPin.value = confirmPin.value.substring(0, confirmPin.value.length - 1);
      } else {
        isConfirmStep.value = false;
        pin.value = pin.value.substring(0, pin.value.length - 1);
      }
    }
  }

  Future<void> _validateAndSave() async {
    if (pin.value == confirmPin.value) {
      await _storage.write(key: 'user_pin', value: pin.value);
      await _storage.write(key: 'is_authenticated', value: 'true'); // Birinchi marta kirdi
      _showAccessibilityDialog();
    } else {
      errorMessage.value = 'PIN kodlar mos kelmadi';
      confirmPin.value = '';
      Get.snackbar('Xato', 'PIN kodlar mos kelmadi', snackPosition: SnackPosition.BOTTOM);
    }
  }

  void _showAccessibilityDialog() {
    Get.dialog(
      AlertDialog(
        title: const Text('Xavfsizlik Sozlamalari'),
        content: const Text(
          'Xavfli havolalarni va virusli dasturlarni avtomatik bloklash uchun ruxsat bering.\n\n'
          'Sozlamalardan "Locksy X" xizmatini yoqing.',
        ),
        actions: [
          TextButton(
            onPressed: () => Get.offAllNamed(AppRoutes.HOME),
            child: const Text('KEYINROQ'),
          ),
          ElevatedButton(
            onPressed: () {
              _securityService.openAccessibilitySettings();
              Get.offAllNamed(AppRoutes.HOME);
            },
            child: const Text('YOQISH'),
          ),
        ],
      ),
      barrierDismissible: false,
    );
  }
}
