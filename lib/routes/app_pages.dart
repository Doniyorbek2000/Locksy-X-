import 'package:get/get.dart';
import 'package:locksy_x/features/auth/controllers/auth_controller.dart';
import 'package:locksy_x/features/auth/views/login_view.dart';
import 'package:locksy_x/features/auth/controllers/setup_pin_controller.dart';
import 'package:locksy_x/features/auth/views/setup_pin_view.dart';
import 'package:locksy_x/features/home/controllers/home_controller.dart';
import 'package:locksy_x/features/home/views/home_view.dart';
import 'package:locksy_x/features/scanner/controllers/apk_scanner_controller.dart';
import 'package:locksy_x/features/scanner/controllers/link_scanner_controller.dart';
import 'package:locksy_x/features/scanner/views/apk_scanner_view.dart';
import 'package:locksy_x/features/scanner/views/link_scanner_view.dart';
import 'package:locksy_x/features/settings/views/settings_view.dart';
import 'package:locksy_x/features/blocked_numbers/controllers/blocked_numbers_controller.dart';
import 'package:locksy_x/features/blocked_numbers/views/blocked_numbers_view.dart';

class AppRoutes {
  static const LOGIN = '/login';
  static const SETUP_PIN = '/setup-pin';
  static const HOME = '/home';
  static const LINK_SCANNER = '/link-scanner';
  static const APK_SCANNER = '/apk-scanner';
  static const SETTINGS = '/settings';
  static const BLOCKED_NUMBERS = '/blocked-numbers';
}

class AppPages {
  static const INITIAL = AppRoutes.LOGIN;

  static final routes = [
    GetPage(
      name: AppRoutes.LOGIN,
      page: () => const LoginView(),
      binding: BindingsBuilder(() {
        Get.lazyPut(() => AuthController());
      }),
    ),
    GetPage(
      name: AppRoutes.SETUP_PIN,
      page: () => const SetupPinView(),
      binding: BindingsBuilder(() {
        Get.lazyPut(() => SetupPinController());
      }),
    ),
    GetPage(
      name: AppRoutes.HOME,
      page: () => const HomeView(),
      binding: BindingsBuilder(() {
        Get.lazyPut(() => HomeController());
      }),
    ),
    GetPage(
      name: AppRoutes.LINK_SCANNER,
      page: () => const LinkScannerView(),
      binding: BindingsBuilder(() {
        Get.lazyPut(() => LinkScannerController());
      }),
    ),
    GetPage(
      name: AppRoutes.APK_SCANNER,
      page: () => const ApkScannerView(),
      binding: BindingsBuilder(() {
        Get.lazyPut(() => ApkScannerController());
      }),
    ),
    GetPage(
      name: AppRoutes.SETTINGS,
      page: () => const SettingsView(),
    ),
    GetPage(
      name: AppRoutes.BLOCKED_NUMBERS,
      page: () => const BlockedNumbersView(),
      binding: BindingsBuilder(() {
        Get.lazyPut(() => BlockedNumbersController());
      }),
    ),
  ];
}
