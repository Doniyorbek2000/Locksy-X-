import 'package:get/get.dart';
import 'package:locksy_x/core/services/api_service.dart';
import 'package:locksy_x/core/services/secure_storage_service.dart';

class BlockedNumbersController extends GetxController {
  var globalNumbers = <dynamic>[].obs;
  var userNumbers = <dynamic>[].obs;
  var isLoading = true.obs;

  @override
  void onInit() {
    super.onInit();
    fetchNumbers();
  }

  Future<void> fetchNumbers() async {
    isLoading.value = true;
    try {
      final api = Get.find<ApiService>();
      final storage = Get.find<SecureStorageService>();
      String? locksyId = await storage.readData('locksyId');
      
      if (locksyId != null) {
        final numbers = await api.getBlockedNumbers(locksyId);
        
        globalNumbers.assignAll(numbers.where((n) => n['userId'] == 'admin'));
        userNumbers.assignAll(numbers.where((n) => n['userId'] != 'admin'));
      }
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> addNumber(String number) async {
    if (number.isEmpty) return;
    try {
      final api = Get.find<ApiService>();
      final storage = Get.find<SecureStorageService>();
      String? locksyId = await storage.readData('locksyId');
      if (locksyId != null) {
        await api.addBlockedNumber(locksyId, number);
        fetchNumbers(); // refresh
      }
    } catch (e) {
      Get.snackbar('Xato', 'Raqam qo\'shishda xatolik yuz berdi');
    }
  }
}
