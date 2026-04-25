import 'package:get/get.dart';
import 'package:locksy_x/core/services/api_service.dart';
import 'package:ota_update/ota_update.dart';
import 'package:package_info_plus/package_info_plus.dart';
import 'package:flutter/material.dart';

class UpdateService extends GetxService {
  final ApiService _apiService = Get.find<ApiService>();

  Future<void> checkForUpdates() async {
    try {
      final updateInfo = await _apiService.checkUpdate();
      if (updateInfo.isEmpty) return;

      final PackageInfo packageInfo = await PackageInfo.fromPlatform();
      final String currentVersion = packageInfo.version;
      final String newVersion = updateInfo['version'];

      if (_isVersionNewer(currentVersion, newVersion)) {
        _showUpdateDialog(updateInfo);
      }
    } catch (e) {
      print('Update check failed: $e');
    }
  }

  bool _isVersionNewer(String current, String newer) {
    List<int> currentV = current.split('.').map(int.parse).toList();
    List<int> newerV = newer.split('.').map(int.parse).toList();
    for (int i = 0; i < currentV.length; i++) {
      if (newerV[i] > currentV[i]) return true;
      if (newerV[i] < currentV[i]) return false;
    }
    return false;
  }

  void _showUpdateDialog(Map<String, dynamic> updateInfo) {
    Get.dialog(
      AlertDialog(
        title: Text('Yangi versiya mavjud: ${updateInfo['version']}'),
        content: Text(updateInfo['changelog'] ?? 'Ilovani yangilash tavsiya etiladi.'),
        actions: [
          if (!(updateInfo['forceUpdate'] ?? false))
            TextButton(
              onPressed: () => Get.back(),
              child: const Text('Keyinroq'),
            ),
          ElevatedButton(
            onPressed: () {
              Get.back();
              _startDownload(updateInfo['url']);
            },
            child: const Text('Yangilash'),
          ),
        ],
      ),
      barrierDismissible: !(updateInfo['forceUpdate'] ?? false),
    );
  }

  void _startDownload(String url) {
    try {
      OtaUpdate().execute(
        url,
        destinationFilename: 'locksy_x_new.apk',
      ).listen(
        (OtaEvent event) {
          print('EVENT: ${event.status} : ${event.value}');
        },
      );
    } catch (e) {
      print('Download failed: $e');
    }
  }
}
