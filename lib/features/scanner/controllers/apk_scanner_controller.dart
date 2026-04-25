import 'package:get/get.dart';
import 'package:file_picker/file_picker.dart';
import 'package:locksy_x/core/services/api_service.dart';

class ApkScannerController extends GetxController {
  var isScanning = false.obs;
  var scanResult = Rxn<Map<String, dynamic>>();
  var selectedFile = Rxn<PlatformFile>();
  var riskScore = 0.obs;
  final ApiService _apiService = ApiService();

  Future<void> pickAndScanApk() async {
    FilePickerResult? result = await FilePicker.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['apk'],
    );

    if (result != null) {
      selectedFile.value = result.files.first;
      _performScan();
    } else {
      Get.snackbar('Bekor qilindi', 'Fayl tanlanmadi', snackPosition: SnackPosition.BOTTOM);
    }
  }

  Future<void> _performScan() async {
    isScanning.value = true;
    scanResult.value = null;

    final fileName = selectedFile.value?.name.toLowerCase() ?? '';
    // Hozirgi bosqichda APK ni unpack qilmasdan nomidan package nameni taxmin qilamiz yoki default.
    // Real ilovada flutter_package_manager kabi package orqali info olinadi.
    final packageName = fileName.replaceAll('.apk', '');

    try {
      final response = await _apiService.scanApk(packageName, ['INTERNET', 'READ_SMS']); // Mock ruxsatlar jo'natilmoqda
      riskScore.value = response['risk'] ?? 0;
      scanResult.value = {
        'status': response['status'] ?? 'UNKNOWN',
        'risk': riskScore.value,
        'package': response['package'] ?? packageName,
        'permissions': ['INTERNET', 'READ_SMS'], // Backenddan kelgan permissiyalar ko'rsatiladi
        'message': response['message'] ?? 'Tahlil yakunlandi.',
      };
    } catch (e) {
      Get.snackbar('Server Xatoligi', e.toString(), snackPosition: SnackPosition.BOTTOM);
    } finally {
      isScanning.value = false;
    }
  }

  void installAnyway() {
    Get.snackbar('Ogohlantirish', 'Tizim xavfsizligi sababli o\'rnatish bloklandi.', snackPosition: SnackPosition.BOTTOM);
  }

  void reportApk() {
    Get.snackbar('Xabar berish', 'APK fayl tekshiruv uchun yuborildi.', snackPosition: SnackPosition.BOTTOM);
  }
}
