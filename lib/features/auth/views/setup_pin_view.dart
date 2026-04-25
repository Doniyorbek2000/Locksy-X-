import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:locksy_x/features/auth/controllers/setup_pin_controller.dart';

class SetupPinView extends GetView<SetupPinController> {
  const SetupPinView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Ro\'yxatdan o\'tish'),
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const SizedBox(height: 40),
              Obx(() => Text(
                  controller.isConfirmStep.value
                      ? 'PIN kodni tasdiqlang'
                      : 'Yangi 4-xonali PIN yarating',
                  style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                )),
              const SizedBox(height: 8),
              const Text(
                'Bu PIN dasturga kirish uchun xizmat qiladi',
                style: TextStyle(color: Colors.grey),
              ),
              const SizedBox(height: 32),
              Obx(() => Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(4, (index) {
                      String current = controller.isConfirmStep.value
                          ? controller.confirmPin.value
                          : controller.pin.value;
                      bool isFilled = index < current.length;
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
          const SizedBox(),
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
}
