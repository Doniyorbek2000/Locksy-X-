import 'dart:async';
import 'package:get/get.dart';
import 'package:locksy_x/core/services/api_service.dart';
import 'package:locksy_x/core/services/secure_storage_service.dart';
import 'package:locksy_x/routes/app_pages.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart' as url_launcher;

class SecurityScanner {
  // Simulated installed app list (on Android real device_apps would be used)
  static final List<Map<String, dynamic>> _simulatedApps = [
    {'name': 'WhatsApp', 'package': 'com.whatsapp', 'permissions': []},
    {'name': 'Chrome', 'package': 'com.android.chrome', 'permissions': []},
    {'name': 'Unknown App', 'package': 'com.unknown.spyware', 'permissions': ['READ_SMS', 'SYSTEM_ALERT_WINDOW']},
  ];

  static Future<List<Map<String, dynamic>>> getInstalledApps() async {
    await Future.delayed(const Duration(seconds: 2)); // simulate scan time
    return _simulatedApps;
  }
}

class HomeController extends GetxController with GetTickerProviderStateMixin {
  final safetyScore = 0.obs;
  final targetScore = 85.obs;
  final lastScanTime = DateTime.now().subtract(const Duration(hours: 2)).obs;
  final riskAppsCount = 0.obs;
  final blockedLinksCount = 0.obs;
  final scamCallDetections = 0.obs;
  final isScanning = false.obs;
  final scanProgress = 0.0.obs;
  final scanStatus = ''.obs;
  final unreadNotifications = 0.obs;
  final notificationsList = <dynamic>[].obs;
  final riskAppsList = <Map<String, dynamic>>[].obs;

  var alerts = <String>[].obs;

  late AnimationController animController;
  late Animation<double> scoreAnimation;

  @override
  void onInit() {
    super.onInit();
    animController = AnimationController(vsync: this, duration: const Duration(milliseconds: 1500));
    
    // Slight delay to allow UI and animations to settle
    Future.delayed(const Duration(milliseconds: 1000), () {
      _checkAds();
      _fetchNotifications();
      _fetchStats();
    });
    
    _startScoreAnimation(85);
    _scheduleAutoScan();
    
    // Periodic refresh for notifications and stats (every 2 minutes)
    Timer.periodic(const Duration(minutes: 2), (_) {
      _fetchNotifications();
      _fetchStats();
    });
  }

  Future<void> _fetchStats() async {
    final api = Get.find<ApiService>();
    final stats = await api.getStats();
    riskAppsCount.value = stats['riskApps'] ?? 0;
    blockedLinksCount.value = stats['blockedLinks'] ?? 0;
    scamCallDetections.value = stats['blockedNumbers'] ?? 0;
    
    // Update score based on stats
    int newScore = 100;
    newScore -= (riskAppsCount.value * 10);
    newScore -= (blockedLinksCount.value * 2);
    newScore = newScore.clamp(0, 100);
    targetScore.value = newScore;
    
    // Update alerts with real info
    alerts.assignAll([
      'Qurilma holati: ${newScore > 80 ? "Xavfsiz" : "Xavf aniqlandi"}',
      'Jami bloklangan havolalar: ${blockedLinksCount.value}',
      'Taqiqlangan raqamlar soni: ${scamCallDetections.value}',
    ]);
  }

  @override
  void onClose() {
    animController.dispose();
    super.onClose();
  }

  void _startScoreAnimation(int target) {
    scoreAnimation = Tween<double>(begin: 0, end: target.toDouble()).animate(
      CurvedAnimation(parent: animController, curve: Curves.easeOut),
    )..addListener(() {
      safetyScore.value = scoreAnimation.value.toInt();
    });
    animController.forward();
  }

  void _scheduleAutoScan() {
    // Auto-scan every 24h (simulated with 24h Timer)
    Timer.periodic(const Duration(hours: 24), (_) => _runAutoScan());
  }

  Future<void> _runAutoScan() async {
    final apps = await SecurityScanner.getInstalledApps();
    final api = Get.find<ApiService>();
    final storage = Get.find<SecureStorageService>();
    final locksyId = await storage.readData('locksyId') ?? 'unknown';

    final dangerous = <Map<String, dynamic>>[];
    for (final app in apps) {
      final result = await api.scanApk(app['package'], List<String>.from(app['permissions']));
      if (result['risk'] != null && result['risk'] > 50) {
        dangerous.add({...app, 'riskScore': result['risk'], 'status': result['status']});
      }
    }

    riskAppsList.assignAll(dangerous);
    riskAppsCount.value = dangerous.length;

    if (dangerous.isNotEmpty) {
      final score = (100 - (dangerous.length * 20)).clamp(0, 100);
      targetScore.value = score;
      animController.reset();
      _startScoreAnimation(score);

      // Show dangerous app dialog
      if (Get.context != null) {
        _showDangerousAppDialog(dangerous.first);
      }
    }
  }

  void _showDangerousAppDialog(Map<String, dynamic> app) {
    Get.dialog(
      AlertDialog(
        backgroundColor: const Color(0xFF131A28),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Row(children: [
          const Icon(Icons.warning, color: Colors.red),
          const SizedBox(width: 8),
          const Text('Xavfli Ilova!', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        ]),
        content: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text('Ilova: ${app['name']}', style: const TextStyle(color: Colors.white70)),
          Text('Xavf darajasi: ${app['riskScore']}%', style: const TextStyle(color: Colors.orange)),
          const SizedBox(height: 12),
          const Text('Bu ilovani o\'chirmoqchimisiz?', style: TextStyle(color: Color(0xFF94A3B8))),
        ]),
        actions: [
          TextButton(
            onPressed: () => Get.back(),
            child: const Text('Davom etish', style: TextStyle(color: Colors.grey)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            onPressed: () {
              Get.back();
              Get.snackbar('O\'chirildi', '${app['name']} ilovasi o\'chirildi', backgroundColor: Colors.red.withOpacity(0.8));
            },
            child: const Text('O\'chirish', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  Future<void> _fetchNotifications() async {
    final api = Get.find<ApiService>();
    final notifs = await api.getNotifications();
    notificationsList.assignAll(notifs);
    unreadNotifications.value = notifs.length;
  }

  Future<void> _checkAds() async {
    try {
      print('Checking for ads...');
      final api = Get.find<ApiService>();
      final ads = await api.getActiveAds();
      print('Active ads found: ${ads.length}');
      if (ads.isNotEmpty) {
        for (final ad in ads) {
          await _showAdDialog(ad);
        }
      }
    } catch (e) {
      print('Error checking ads: $e');
    }
  }

  Future<void> _showAdDialog(Map<String, dynamic> ad) async {
    if (Get.context == null) return;
    
    int timeLeft = ad['durationSeconds'] ?? 5;
    RxInt currentLeft = timeLeft.obs;
    final Completer<void> completer = Completer<void>();

    Get.dialog(
      WillPopScope(
        onWillPop: () async => false,
        child: Dialog(
          backgroundColor: Colors.transparent,
          insetPadding: EdgeInsets.zero,
          child: Container(
            width: double.infinity,
            height: double.infinity,
            color: Colors.black.withOpacity(0.95),
            child: Stack(alignment: Alignment.center, children: [
              Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                if (ad['type'] == 'image')
                  Expanded(child: Image.network(ad['content'], fit: BoxFit.contain))
                else if (ad['type'] == 'video')
                  const Expanded(child: Center(child: Icon(Icons.play_circle_outline, color: Colors.white, size: 100)))
                else
                  Padding(
                    padding: const EdgeInsets.all(32),
                    child: Text(ad['content'], style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold), textAlign: TextAlign.center),
                  ),
                
                if (ad['buttonText'] != null && ad['buttonText'].toString().isNotEmpty)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 60),
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF00E676),
                        padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 15),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                      ),
                      onPressed: () async {
                        final url = Uri.parse(ad['targetUrl'] ?? '');
                        try {
                          await url_launcher.launchUrl(url, mode: url_launcher.LaunchMode.externalApplication);
                        } catch (e) {
                          Get.snackbar('Xato', 'Havolani ochib bo\'lmadi');
                        }
                      },
                      child: Text(ad['buttonText'], style: const TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 18)),
                    ),
                  ),
              ]),

              Positioned(
                top: 48, right: 24,
                child: Obx(() {
                  if (currentLeft.value > 0) {
                    Future.delayed(const Duration(seconds: 1), () {
                      if (currentLeft.value > 0) currentLeft.value--;
                    });
                    return Container(
                      width: 45, height: 45,
                      decoration: BoxDecoration(shape: BoxShape.circle, color: Colors.black54, border: Border.all(color: Colors.white30, width: 2)),
                      child: Center(child: Text('${currentLeft.value}', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold))),
                    );
                  }
                  return IconButton(
                    icon: const Icon(Icons.close, color: Colors.white, size: 35),
                    onPressed: () {
                      Get.back();
                      completer.complete();
                    },
                  );
                }),
              )
            ]),
          ),
        ),
      ),
      barrierDismissible: false,
    );

    return completer.future;
  }

  void openNotifications() {
    unreadNotifications.value = 0;
    Get.bottomSheet(
      Container(
        padding: const EdgeInsets.all(20),
        decoration: const BoxDecoration(
          color: Color(0xFF131A28),
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(children: [
          Container(width: 40, height: 4, decoration: BoxDecoration(color: Colors.grey[600], borderRadius: BorderRadius.circular(2))),
          const SizedBox(height: 16),
          const Text('Bildirishnomalar', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
          const SizedBox(height: 16),
          Expanded(
            child: Obx(() {
              if (notificationsList.isEmpty) {
                return const Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                  Icon(Icons.notifications_none, color: Colors.grey, size: 48),
                  SizedBox(height: 8),
                  Text('Hozircha xabarlar yo\'q', style: TextStyle(color: Colors.grey)),
                ]));
              }
              return ListView.builder(
                itemCount: notificationsList.length,
                itemBuilder: (_, i) {
                  final n = notificationsList[i];
                  return Container(
                    margin: const EdgeInsets.only(bottom: 8),
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: const Color(0xFF0D1424),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFF1E2D45)),
                    ),
                    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                        Text(n['title'] ?? '', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                        Text(DateFormat('HH:mm').format(DateTime.parse(n['createdAt'])), style: TextStyle(color: Colors.grey[600], fontSize: 11)),
                      ]),
                      const SizedBox(height: 4),
                      Text(n['message'] ?? '', style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 13)),
                    ]),
                  );
                },
              );
            }),
          ),
        ]),
      ),
      isScrollControlled: true,
    );
  }

  Future<void> scanNow() async {
    isScanning.value = true;
    scanStatus.value = 'Tekshirilmoqda...';
    scanProgress.value = 0;

    final apps = await SecurityScanner.getInstalledApps();
    final api = Get.find<ApiService>();
    final dangerous = <Map<String, dynamic>>[];

    for (int i = 0; i < apps.length; i++) {
      scanProgress.value = (i + 1) / apps.length;
      scanStatus.value = '${apps[i]['name']} tekshirilmoqda...';
      final result = await api.scanApk(apps[i]['package'], List<String>.from(apps[i]['permissions']));
      if ((result['risk'] ?? 0) > 50) {
        dangerous.add({...apps[i], ...result});
      }
      await Future.delayed(const Duration(milliseconds: 500));
    }

    riskAppsList.assignAll(dangerous);
    riskAppsCount.value = dangerous.length;

    // Auto-delete logic for CRITICAL threats
    for (final app in dangerous) {
      if (app['severity'] == 'CRITICAL' || (app['riskScore'] ?? 0) > 90) {
        // In real Android, this would trigger an uninstallation intent or system-level deletion if possible
        Get.snackbar('Hafli Ilova O\'chirildi', '${app['name']} avtomatik ravishda o\'chirildi (Admin buyrug\'i)', 
          backgroundColor: Colors.red, colorText: Colors.white, duration: const Duration(seconds: 5));
        riskAppsList.removeWhere((x) => x['package'] == app['package']);
      }
    }

    riskAppsCount.value = riskAppsList.length;
    final score = riskAppsList.isEmpty ? 100 : (100 - (riskAppsList.length * 25)).clamp(0, 100);
    targetScore.value = score;
    animController.reset();
    _startScoreAnimation(score);

    lastScanTime.value = DateTime.now();
    isScanning.value = false;
    scanStatus.value = '';
    scanProgress.value = 0;

    // Update real stats after scan
    _fetchStats();

    if (riskAppsList.isEmpty) {
      Get.snackbar('✅ Xavfsiz!', 'Hech qanday xavfli ilova qolmadi!',
          backgroundColor: const Color(0xFF00E676).withOpacity(0.9), colorText: Colors.black);
    } else {
      for (final app in riskAppsList) {
        _showDangerousAppDialog(app);
        break;
      }
    }
  }

  void checkLink() => Get.toNamed(AppRoutes.LINK_SCANNER);
  void scanApk() => scanNow();
  void viewRiskApps() => Get.toNamed(AppRoutes.BLOCKED_NUMBERS);
  void openSecurityCenter() {
    Get.snackbar('Security Center', 'Xavfsizlik markazi', snackPosition: SnackPosition.BOTTOM);
  }
  Future<void> lockApp() async => Get.offAllNamed(AppRoutes.LOGIN);
}
