import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:locksy_x/features/scanner/controllers/link_scanner_controller.dart';

class LinkScannerView extends GetView<LinkScannerController> {
  const LinkScannerView({super.key});

  @override
  Widget build(BuildContext context) {
    final TextEditingController urlController = TextEditingController();

    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: const Text('Link Scanner', style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Havola xavfsizligini tekshirish',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            const Text(
              'Shubhali yoki noma\'lum havolalarni (URL) kiritib, ularning xavfsizlik darajasini tekshiring.',
              style: TextStyle(fontSize: 14, color: Colors.grey),
            ),
            const SizedBox(height: 24),
            TextField(
              controller: urlController,
              decoration: InputDecoration(
                hintText: 'https://example.com',
                prefixIcon: const Icon(Icons.link),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                filled: true,
                fillColor: Colors.white,
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: Obx(() => ElevatedButton(
                    onPressed: controller.isScanning.value
                        ? null
                        : () => controller.scanUrl(urlController.text),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF1E3A8A),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: controller.isScanning.value
                        ? const CircularProgressIndicator(color: Colors.white)
                        : const Text('TEKSHIRISH', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
                  )),
            ),
            const SizedBox(height: 32),
            Obx(() {
              if (controller.scanResult.value != null) {
                return _buildResultCard();
              }
              return const SizedBox.shrink();
            }),
          ],
        ),
      ),
    );
  }

  Widget _buildResultCard() {
    final result = controller.scanResult.value!;
    final bool isSafe = result['status'] == 'SAFE';
    final Color statusColor = isSafe ? Colors.green : Colors.red;
    final IconData statusIcon = isSafe ? Icons.check_circle : Icons.warning;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: statusColor.withOpacity(0.5), width: 2),
        boxShadow: [
          BoxShadow(color: statusColor.withOpacity(0.1), blurRadius: 10, offset: const Offset(0, 4)),
        ],
      ),
      child: Column(
        children: [
          Icon(statusIcon, color: statusColor, size: 64),
          const SizedBox(height: 12),
          Text(
            result['status'],
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: statusColor),
          ),
          const SizedBox(height: 8),
          Text(
            result['message'],
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 14, color: Colors.black87),
          ),
          const SizedBox(height: 16),
          LinearProgressIndicator(
            value: controller.riskScore.value / 100,
            backgroundColor: Colors.grey[200],
            valueColor: AlwaysStoppedAnimation<Color>(statusColor),
            minHeight: 8,
            borderRadius: BorderRadius.circular(4),
          ),
          const SizedBox(height: 8),
          Text('Xavf darajasi: ${controller.riskScore.value}%', style: const TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              if (isSafe)
                OutlinedButton.icon(
                  onPressed: controller.openLink,
                  icon: const Icon(Icons.open_in_browser),
                  label: const Text('Ochish'),
                ),
              if (!isSafe)
                ElevatedButton.icon(
                  onPressed: controller.reportLink,
                  icon: const Icon(Icons.report, color: Colors.white),
                  label: const Text('Xabar Berish', style: TextStyle(color: Colors.white)),
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
                ),
            ],
          )
        ],
      ),
    );
  }
}
