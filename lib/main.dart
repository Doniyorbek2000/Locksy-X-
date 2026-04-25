import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:locksy_x/core/services/auth_service.dart';
import 'package:locksy_x/core/services/secure_storage_service.dart';
import 'package:locksy_x/core/theme/app_theme.dart';
import 'package:locksy_x/core/services/crypto_service.dart';
import 'package:locksy_x/core/services/api_service.dart';
import 'package:locksy_x/core/services/security_service.dart';
import 'package:locksy_x/core/services/update_service.dart';
import 'package:locksy_x/core/localization/app_translations.dart';
import 'package:locksy_x/routes/app_pages.dart';
import 'dart:math';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  await initServices();

  runApp(const LocksyXApp());
}

Future<void> initServices() async {
  try {
    print('Initializing services...');
    final storage = Get.put(SecureStorageService());
    Get.put(AuthService());
    Get.put(ApiService());
    Get.put(SecurityService());
    final updateService = Get.put(UpdateService());
    
    final crypto = Get.put(CryptoService());
    await crypto.initialize();

    // Yangilanishni tekshirish
    updateService.checkForUpdates();

    // Auto-register user
    final api = Get.find<ApiService>();
    String? locksyId = await storage.readData('locksyId');
    
    if (locksyId == null) {
      locksyId = 'LX-' + (10000000 + Random().nextInt(89999999)).toString();
      await storage.writeData('locksyId', locksyId);
    }
    
    print('User ID: $locksyId');
    
    // Attempt registration but don't block app if server is down
    try {
      // Hududni avtomatik aniqlash
      String realRegion = await api.getUserRegion();
      await api.registerUser(locksyId, realRegion);
      print('User registered in: $realRegion');
    } catch (e) {
      print('Failed to register user: $e');
    }
    
    print('Services initialized successfully');
  } catch (e) {
    print('CRITICAL ERROR DURING INIT: $e');
  }
}

class LocksyXApp extends StatelessWidget {
  const LocksyXApp({super.key});

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      title: 'Locksy X',
      debugShowCheckedModeBanner: false,
      translations: AppTranslations(),
      locale: const Locale('uz', 'UZ'),
      fallbackLocale: const Locale('en', 'US'),
      theme: AppTheme.darkTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.dark,
      initialRoute: AppPages.INITIAL,
      getPages: AppPages.routes,
      defaultTransition: Transition.cupertino,
    );
  }
}
