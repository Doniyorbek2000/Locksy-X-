import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:locksy_x/features/auth/controllers/auth_controller.dart';

class LoginView extends GetView<AuthController> {
  const LoginView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.lock_outline,
              size: 64,
              color: Color(0xFF1E3A8A),
            ),
            const SizedBox(height: 16),
            const Text(
              'Locksy X',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Tizimga kirish uchun PIN kodni kiriting',
              style: TextStyle(color: Colors.grey),
            ),
            const SizedBox(height: 32),
            Obx(() => Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: List.generate(4, (index) {
                    bool isFilled = index < controller.enteredPin.value.length;
                    return Container(
                      margin: const EdgeInsets.symmetric(horizontal: 8),
                      width: 20,
                      height: 20,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: isFilled ? const Color(0xFF1E3A8A) : Colors.grey[300],
                      ),
                    );
                  }),
                )),
            const SizedBox(height: 16),
            Obx(() => Text(
                  controller.errorMessage.value,
                  style: const TextStyle(color: Colors.red),
                )),
            const SizedBox(height: 48),
            _buildKeypad(),
          ],
        ),
      ),
    );
  }

  Widget _buildKeypad() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 40),
      child: GridView.count(
        shrinkWrap: true,
        crossAxisCount: 3,
        childAspectRatio: 1.5,
        physics: const NeverScrollableScrollPhysics(),
        children: [
          for (var i = 1; i <= 9; i++) _buildKey(i.toString()),
          _buildBiometricKey(),
          _buildKey('0'),
          _buildBackspaceKey(),
        ],
      ),
    );
  }

  Widget _buildKey(String text) {
    return InkWell(
      onTap: () => controller.addDigit(text),
      customBorder: const CircleBorder(),
      child: Center(
        child: Text(
          text,
          style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w500),
        ),
      ),
    );
  }

  Widget _buildBackspaceKey() {
    return InkWell(
      onTap: controller.removeDigit,
      customBorder: const CircleBorder(),
      child: const Center(
        child: Icon(Icons.backspace_outlined, size: 28),
      ),
    );
  }

  Widget _buildBiometricKey() {
    return InkWell(
      onTap: controller.authenticateBiometric,
      customBorder: const CircleBorder(),
      child: const Center(
        child: Icon(Icons.fingerprint, size: 32, color: Color(0xFF1E3A8A)),
      ),
    );
  }
}
