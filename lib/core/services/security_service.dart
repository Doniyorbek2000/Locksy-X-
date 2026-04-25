import 'dart:async';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:locksy_x/core/services/api_service.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:intl/intl.dart';
import 'package:flutter/services.dart';
import 'package:device_apps/device_apps.dart';
import 'package:url_launcher/url_launcher.dart';

class SecurityService extends GetxService {
  final ApiService _apiService = ApiService();
  final FlutterLocalNotificationsPlugin _notifications = FlutterLocalNotificationsPlugin();

  final _blacklistedUrls = <String>[].obs;
  final _maliciousPackages = <String>[
    'com.example.spyware',
    'com.evil.malware',
    'org.badapp.hacker'
  ].obs;

  var lastSyncTime = 'Hali tekshirilmagan'.obs;
  var isScanning = false.obs;
  var securityScore = 100.obs;
  var scanProgress = 0.0.obs;
  var currentScanningApp = ''.obs;

  @override
  void onInit() {
    super.onInit();
    _initNotifications();
    _setupAutoSync();
    _startPersistenceMode();
    requestPermissions();
    _listenClipboard();
  }

  Future<void> requestPermissions() async {
    await [
      Permission.notification,
      Permission.sms,
      Permission.phone,
    ].request();
    
    // Accessibility ruxsatini so'rash (Yo'naltirish orqali)
    _checkAccessibility();
  }

  Future<void> _checkAccessibility() async {
    // Bu metod sozlamalarni ochadi
    // Foydalanuvchi u yerdan Locksy X ni topib yoqishi kerak
  }

  void openAccessibilitySettings() async {
    const intent = 'android.settings.ACCESSIBILITY_SETTINGS';
    final url = Uri.parse('package:locksy_x'); // Bu qism odatda platform-specific bo'ladi
    
    // Android sozlamalarini ochish buyrug'i
    const MethodChannel('com.example.locksy_x/settings').invokeMethod('openAccessibility');
  }

  void _initNotifications() async {
    const AndroidInitializationSettings initializationSettingsAndroid =
        AndroidInitializationSettings('@mipmap/ic_launcher');
    const InitializationSettings initializationSettings =
        InitializationSettings(android: initializationSettingsAndroid);
    await _notifications.initialize(initializationSettings);
  }

  void _startPersistenceMode() async {
    const AndroidNotificationDetails androidPlatformChannelSpecifics =
        AndroidNotificationDetails(
            'persistent_security', 
            'Locksy Active Shield',
            importance: Importance.low,
            priority: Priority.low,
            ongoing: true,
            icon: '@mipmap/ic_launcher');
    const NotificationDetails platformChannelSpecifics =
        NotificationDetails(android: androidPlatformChannelSpecifics);
    await _notifications.show(888, 'Locksy X: Himoya Faol', 'Qurilmangiz kiber-himoya ostida', platformChannelSpecifics);
  }

  void _setupAutoSync() {
    Timer.periodic(const Duration(hours: 12), (timer) => updateThreats());
    updateThreats();
  }

  Future<void> updateThreats() async {
    try {
      final threats = await _apiService.getGlobalThreats();
      _blacklistedUrls.assignAll(List<String>.from(threats['urls'] ?? []));
      if (threats['maliciousPackages'] != null) {
        _maliciousPackages.addAll(List<String>.from(threats['maliciousPackages']));
      }
    } catch (e) {
      print('Sync Error: $e');
    }
  }

  // HAQIQIY DEEP SCAN (REALLIK)
  Future<void> runDeepScan() async {
    isScanning.value = true;
    scanProgress.value = 0.0;
    securityScore.value = 100;
    
    // 1. Telefondagi haqiqiy ilovalarni olish
    List<Application> apps = await DeviceApps.getInstalledApplications(
      includeAppIcons: false,
      includeSystemApps: true,
      onlyAppsWithLaunchIntent: false,
    );

    int totalApps = apps.length;
    int threatsFound = 0;

    for (int i = 0; i < totalApps; i++) {
      Application app = apps[i];
      currentScanningApp.value = '${app.appName} tekshirilmoqda...';
      scanProgress.value = (i + 1) / totalApps;

      // Xavfli paketlarni bazadagi "maliciousPackages" bilan solishtirish
      if (_maliciousPackages.contains(app.packageName)) {
        threatsFound++;
        securityScore.value -= 15; // Har bir xavf uchun balni tushirish
      }

      // Sun'iy biroz kechikish (interfeys muzlab qolmasligi uchun)
      if (i % 5 == 0) await Future.delayed(const Duration(milliseconds: 50));
    }
    
    isScanning.value = false;
    currentScanningApp.value = threatsFound > 0 
        ? 'Xavf aniqlandi: $threatsFound ta!' 
        : 'Skanerlash yakunlandi. Qurilma toza.';
    
    DateTime now = DateTime.now();
    lastSyncTime.value = DateFormat('HH:mm, d MMM').format(now);
    
    _showSecurityAlert(
      threatsFound > 0 ? 'DIQQAT: XAVF!' : 'Skanerlash yakunlandi', 
      threatsFound > 0 ? '$threatsFound ta shubhali ilova topildi.' : 'Qurilmangiz to\'liq tekshirildi.'
    );
  }

  void _listenClipboard() {
    Timer.periodic(const Duration(seconds: 5), (timer) async {
      ClipboardData? data = await Clipboard.getData(Clipboard.kTextPlain);
      if (data?.text != null) {
        _analyzeLink(data!.text!);
      }
    });
  }

  void _analyzeLink(String text) async {
    if (text.startsWith('http') || text.contains('www.')) {
      final dangerKeywords = ['terror', 'ekstrem', 'xalifalik', 'scam', 'prize', 'porn'];
      bool isDangerous = _blacklistedUrls.any((u) => text.contains(u)) || 
                         dangerKeywords.any((k) => text.toLowerCase().contains(k));

      if (isDangerous) {
        _showSecurityAlert('BLOKLANDI!', 'Xavfli link aniqlandi. Kirish tavsiya etilmaydi.');
      }
    }
  }

  void _showSecurityAlert(String title, String body) async {
    final AndroidNotificationDetails androidPlatformChannelSpecifics =
        AndroidNotificationDetails('security_alerts', 'Xavfsizlik',
            importance: Importance.max, priority: Priority.high, 
            color: const Color(0xFFFF0000), playSound: true);
    final NotificationDetails platformChannelSpecifics =
        NotificationDetails(android: androidPlatformChannelSpecifics);
    await _notifications.show(DateTime.now().millisecond, title, body, platformChannelSpecifics);
  }
}
