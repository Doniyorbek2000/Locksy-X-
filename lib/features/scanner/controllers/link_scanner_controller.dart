import 'package:get/get.dart';
import 'package:locksy_x/core/services/api_service.dart';

class LinkScannerController extends GetxController {
  var urlToScan = ''.obs;
  var isScanning = false.obs;
  var scanResult = Rxn<Map<String, dynamic>>();
  var riskScore = 0.obs;
  final ApiService _apiService = ApiService();

  void scanUrl(String url) async {
    if (url.isEmpty || !url.startsWith('http')) {
      Get.snackbar('Xato', 'Iltimos, to\'g\'ri URL kiriting (http/https)', snackPosition: SnackPosition.BOTTOM);
      return;
    }
    
    urlToScan.value = url;
    isScanning.value = true;
    scanResult.value = null;

    try {
      final response = await _apiService.scanUrl(url);
      riskScore.value = response['risk'] ?? 0;
      scanResult.value = {
        'status': response['status'] ?? 'UNKNOWN',
        'risk': riskScore.value,
        'message': response['message'] ?? 'Tahlil yakunlandi.',
      };
    } catch (e) {
      Get.snackbar('Xatolik', e.toString(), snackPosition: SnackPosition.BOTTOM);
    } finally {
      isScanning.value = false;
    }
  }

  void openLink() {
    Get.snackbar('Ochish', 'Havolaga o\'tilmoqda...', snackPosition: SnackPosition.BOTTOM);
  }

  void reportLink() {
    Get.snackbar('Xabar berish', 'Havola xavfli deb xabar qilindi.', snackPosition: SnackPosition.BOTTOM);
  }
}
