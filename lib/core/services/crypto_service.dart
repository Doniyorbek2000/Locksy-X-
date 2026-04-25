import 'dart:convert';
import 'package:encrypt/encrypt.dart' as enc;
import 'package:get/get.dart';
import 'package:locksy_x/core/services/secure_storage_service.dart';

class CryptoService extends GetxService {
  final SecureStorageService _storage = Get.find<SecureStorageService>();
  
  late final enc.Key _key;
  late final enc.Encrypter _encrypter;

  @override
  void onInit() {
    super.onInit();
  }

  Future<void> initialize() async {
    // Master kalitni xavfsiz xotiradan olish yoki yangi yaratish
    String? base64Key = await _storage.readData('master_encryption_key');
    if (base64Key == null) {
      _key = enc.Key.fromSecureRandom(32); // 256-bit AES kaliti
      await _storage.writeData('master_encryption_key', _key.base64);
    } else {
      _key = enc.Key.fromBase64(base64Key);
    }
    
    // AES-GCM (Production standart)
    _encrypter = enc.Encrypter(enc.AES(_key, mode: enc.AESMode.gcm));
  }

  String encryptData(String plainText) {
    final iv = enc.IV.fromSecureRandom(16); // Har bir ma'lumot uchun yangi IV
    final encrypted = _encrypter.encrypt(plainText, iv: iv);
    
    // IV va shifrlangan ma'lumotni birlashtiramiz (qayta o'qish uchun IV kerak)
    final Map<String, dynamic> payload = {
      'iv': iv.base64,
      'data': encrypted.base64,
    };
    return base64Encode(utf8.encode(jsonEncode(payload)));
  }

  String decryptData(String encryptedPayload) {
    try {
      final decodedJson = jsonDecode(utf8.decode(base64Decode(encryptedPayload)));
      final iv = enc.IV.fromBase64(decodedJson['iv']);
      final encrypted = enc.Encrypted.fromBase64(decodedJson['data']);
      
      return _encrypter.decrypt(encrypted, iv: iv);
    } catch (e) {
      // Security: Xatolikni fosh qilmaslik kerak
      throw Exception('Ma\'lumotni shifrdan yechishda xatolik');
    }
  }
}
