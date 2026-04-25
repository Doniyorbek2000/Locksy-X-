import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:locksy_x/features/scanner/controllers/apk_scanner_controller.dart';

class ApkScannerView extends GetView<ApkScannerController> {
  const ApkScannerView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: const Text('APK Scanner', style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const Icon(Icons.android, size: 80, color: Colors.green),
            const SizedBox(height: 16),
            const Text(
              'O\'rnatishdan oldin APK faylni tekshiring',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            const Text(
              'Locksy X sun\'iy intellekti APK fayldagi zararli kodlarni, yashirin ruxsatlarni va firibgarlik modifikatsiyalarini aniqlaydi.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 14, color: Colors.grey),
            ),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              height: 60,
              child: Obx(() => ElevatedButton.icon(
                    onPressed: controller.isScanning.value ? null : controller.pickAndScanApk,
                    icon: controller.isScanning.value
                        ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                        : const Icon(Icons.upload_file, color: Colors.white),
                    label: Text(
                      controller.isScanning.value ? 'Tekshirilmoqda...' : 'APK Faylni Tanlash',
                      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF1E3A8A),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    ),
                  )),
            ),
            const SizedBox(height: 32),
            Expanded(
              child: Obx(() {
                if (controller.scanResult.value != null) {
                  return SingleChildScrollView(child: _buildResultCard());
                }
                if (controller.isScanning.value) {
                  return const Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        CircularProgressIndicator(),
                        SizedBox(height: 16),
                        Text('Tizim bazasi bilan solishtirilmoqda...'),
                      ],
                    ),
                  );
                }
                return const SizedBox.shrink();
              }),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildResultCard() {
    final result = controller.scanResult.value!;
    final bool isSafe = result['status'] == 'SAFE';
    final Color statusColor = isSafe ? Colors.green : Colors.red;
    final IconData statusIcon = isSafe ? Icons.verified_user : Icons.gpp_bad;

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
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(child: Icon(statusIcon, color: statusColor, size: 64)),
          const SizedBox(height: 12),
          Center(
            child: Text(
              result['status'],
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: statusColor),
            ),
          ),
          const SizedBox(height: 8),
          Center(
            child: Text(
              result['message'],
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 14, color: Colors.black87),
            ),
          ),
          const Divider(height: 32),
          const Text('Fayl ma\'lumotlari:', style: TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Text('Nomi: ${controller.selectedFile.value?.name ?? "Noma'lum"}'),
          Text('Paket: ${result['package']}'),
          const SizedBox(height: 16),
          const Text('Xavfli Ruxsatlar:', style: TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: (result['permissions'] as List<String>).map((perm) {
              return Chip(
                label: Text(perm, style: const TextStyle(fontSize: 10, color: Colors.white)),
                backgroundColor: isSafe ? Colors.green.shade300 : Colors.red.shade400,
                padding: EdgeInsets.zero,
              );
            }).toList(),
          ),
          const SizedBox(height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              if (!isSafe) ...[
                OutlinedButton(
                  onPressed: controller.installAnyway,
                  child: const Text('O\'rnatish', style: TextStyle(color: Colors.red)),
                ),
                ElevatedButton.icon(
                  onPressed: controller.reportApk,
                  icon: const Icon(Icons.delete, color: Colors.white),
                  label: const Text('O\'chirish', style: TextStyle(color: Colors.white)),
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
                ),
              ],
              if (isSafe)
                ElevatedButton.icon(
                  onPressed: controller.installAnyway,
                  icon: const Icon(Icons.install_mobile, color: Colors.white),
                  label: const Text('O\'rnatish', style: TextStyle(color: Colors.white)),
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
                ),
            ],
          )
        ],
      ),
    );
  }
}
