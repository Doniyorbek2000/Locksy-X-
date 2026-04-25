import 'package:flutter/services.dart';
import 'package:local_auth/local_auth.dart';
import 'package:get/get.dart';

class AuthService extends GetxService {
  final LocalAuthentication _auth = LocalAuthentication();

  Future<bool> authenticate() async {
    try {
      final bool canAuthenticateWithBiometrics = await _auth.canCheckBiometrics;
      final bool canAuthenticate =
          canAuthenticateWithBiometrics || await _auth.isDeviceSupported();

      if (!canAuthenticate) {
        // Agar qurilma biometriyani qo'llab-quvvatlamasa, ruxsat bermaslik yoxud pin so'rash (Security)
        return false;
      }

      return await _auth.authenticate(
        localizedReason: 'Locksy X tizimiga kirish uchun tasdiqlang',
      );
    } on PlatformException catch (e) {
      if (e.code == 'NotAvailable' || e.code == 'PasscodeNotSet') {
         Get.snackbar('Xavfsizlik ogohlantirishi', 'Qurilmada xavfsizlik o\'rnatilmagan');
      }
      return false;
    } catch (e) {
      return false;
    }
  }
}
