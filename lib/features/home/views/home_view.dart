import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:locksy_x/features/home/controllers/home_controller.dart';
import 'package:locksy_x/routes/app_pages.dart';
import 'package:intl/intl.dart';
import 'dart:math' as math;

class HomeView extends GetView<HomeController> {
  const HomeView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(children: const [
          Icon(Icons.shield, color: Color(0xFF00E676), size: 22),
          SizedBox(width: 8),
          Text('LOCKSY X', style: TextStyle(letterSpacing: 2, fontWeight: FontWeight.bold)),
        ]),
        actions: [
          Obx(() => Stack(alignment: Alignment.center, children: [
            IconButton(
              icon: const Icon(Icons.notifications_none, size: 26),
              onPressed: controller.openNotifications,
            ),
            if (controller.unreadNotifications.value > 0)
              Positioned(
                right: 10, top: 10,
                child: Container(
                  width: 16, height: 16,
                  decoration: const BoxDecoration(color: Colors.red, shape: BoxShape.circle),
                  child: Center(child: Text('${controller.unreadNotifications.value}', style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold))),
                ),
              )
          ])),
          IconButton(
            icon: const Icon(Icons.settings_outlined),
            onPressed: () => Get.toNamed(AppRoutes.SETTINGS),
          ),
        ],
      ),
      body: Obx(() => SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          _buildScoreCard(),
          const SizedBox(height: 20),
          _buildScanProgress(),
          const SizedBox(height: 20),
          const Text('Tez Amallar', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
          const SizedBox(height: 12),
          _buildActionGrid(),
          const SizedBox(height: 24),
          const Text('Statistika', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
          const SizedBox(height: 12),
          _buildThreatStats(),
          const SizedBox(height: 24),
          if (controller.riskAppsList.isNotEmpty) ...[
            Row(children: [
              const Icon(Icons.warning, color: Colors.redAccent, size: 20),
              const SizedBox(width: 6),
              const Text('Xavfli Ilovalar', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
            ]),
            const SizedBox(height: 12),
            _buildRiskApps(),
            const SizedBox(height: 24),
          ],
          const Text('So\'nggi Ogohlantirishlar', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
          const SizedBox(height: 12),
          _buildAlertsFeed(),
          const SizedBox(height: 20),
        ]),
      )),
    );
  }

  Widget _buildScoreCard() {
    return Obx(() {
      final score = controller.safetyScore.value;
      final Color scoreColor = score > 80 ? const Color(0xFF00E676) : (score > 50 ? Colors.orange : Colors.redAccent);
      final String status = score > 80 ? 'XAVFSIZ' : (score > 50 ? 'DIQQAT' : 'XAVFLI');

      return Container(
        padding: const EdgeInsets.all(28),
        decoration: BoxDecoration(
          gradient: RadialGradient(
            center: Alignment.topLeft,
            radius: 1.5,
            colors: [scoreColor.withOpacity(0.08), const Color(0xFF131A28)],
          ),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: scoreColor.withOpacity(0.3), width: 1.5),
        ),
        child: Column(children: [
          Text('Qurilma Xavfsizlik Darajasi', style: TextStyle(fontSize: 14, color: Colors.grey[400])),
          const SizedBox(height: 24),
          SizedBox(
            width: 180, height: 180,
            child: CustomPaint(
              painter: _ScoreRingPainter(score / 100, scoreColor),
              child: Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                TweenAnimationBuilder<double>(
                  tween: Tween(begin: 0, end: score.toDouble()),
                  duration: const Duration(milliseconds: 1200),
                  builder: (_, val, __) => Text(
                    '${val.toInt()}',
                    style: TextStyle(fontSize: 52, fontWeight: FontWeight.bold, color: scoreColor, height: 1),
                  ),
                ),
                Container(
                  margin: const EdgeInsets.only(top: 4),
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                  decoration: BoxDecoration(
                    color: scoreColor.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: scoreColor.withOpacity(0.4)),
                  ),
                  child: Text(status, style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: scoreColor, letterSpacing: 1)),
                ),
              ])),
            ),
          ),
          const SizedBox(height: 16),
          Text(
            'So\'nggi tekshiruv: ${DateFormat('HH:mm, dd MMM').format(controller.lastScanTime.value)}',
            style: TextStyle(color: Colors.grey[500], fontSize: 12),
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: controller.isScanning.value ? null : controller.scanNow,
              icon: controller.isScanning.value
                  ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.black))
                  : const Icon(Icons.radar, color: Colors.black),
              label: Text(controller.isScanning.value ? 'Skanerlanyapti...' : 'SKANERLAMOQ',
                  style: const TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1, color: Colors.black)),
            ),
          ),
        ]),
      );
    });
  }

  Widget _buildScanProgress() {
    return Obx(() {
      if (!controller.isScanning.value) return const SizedBox.shrink();
      return Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: const Color(0xFF131A28),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0xFF233045)),
        ),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(controller.scanStatus.value, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w500)),
          const SizedBox(height: 10),
          LinearProgressIndicator(
            value: controller.scanProgress.value,
            backgroundColor: const Color(0xFF0A0E17),
            valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF00E676)),
            minHeight: 6,
            borderRadius: BorderRadius.circular(3),
          ),
          const SizedBox(height: 6),
          Text('${(controller.scanProgress.value * 100).toInt()}% tugallandi', style: TextStyle(color: Colors.grey[500], fontSize: 12)),
        ]),
      );
    });
  }

  Widget _buildActionGrid() {
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 4,
      mainAxisSpacing: 12,
      crossAxisSpacing: 12,
      children: [
        _actionItem(Icons.radar, 'Skanerla', const Color(0xFF00E676), controller.scanNow),
        _actionItem(Icons.link, 'Link Tekshir', const Color(0xFF00B0FF), controller.checkLink),
        _actionItem(Icons.phone_disabled, 'Taqiq. Raq.', Colors.orange, controller.viewRiskApps),
        _actionItem(Icons.shield_outlined, 'Xavfsizlik', Colors.purpleAccent, controller.openSecurityCenter),
      ],
    );
  }

  Widget _actionItem(IconData icon, String label, Color color, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        Container(
          width: 56, height: 56,
          decoration: BoxDecoration(
            color: color.withOpacity(0.12),
            shape: BoxShape.circle,
            border: Border.all(color: color.withOpacity(0.35)),
          ),
          child: Icon(icon, color: color, size: 26),
        ),
        const SizedBox(height: 6),
        Text(label, style: const TextStyle(fontSize: 11, color: Colors.white70), textAlign: TextAlign.center, maxLines: 2),
      ]),
    );
  }

  Widget _buildThreatStats() {
    return Row(children: [
      Expanded(child: _statCard('Xavfli Ilovalar', controller.riskAppsCount.value, Icons.warning_amber, Colors.orange)),
      const SizedBox(width: 10),
      Expanded(child: _statCard('Bloklangan', controller.blockedLinksCount.value, Icons.link_off, Colors.redAccent)),
      const SizedBox(width: 10),
      Expanded(child: _statCard('Spam Qo\'ng\'iroq', controller.scamCallDetections.value, Icons.phone_disabled, Colors.deepOrange)),
    ]);
  }

  Widget _statCard(String title, int count, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFF131A28),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: color.withOpacity(0.25)),
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Icon(icon, color: color, size: 22),
        const SizedBox(height: 8),
        Text('$count', style: const TextStyle(fontSize: 26, fontWeight: FontWeight.bold, color: Colors.white, height: 1)),
        const SizedBox(height: 2),
        Text(title, style: TextStyle(fontSize: 11, color: Colors.grey[500]), maxLines: 1, overflow: TextOverflow.ellipsis),
      ]),
    );
  }

  Widget _buildRiskApps() {
    return Column(children: controller.riskAppsList.map((app) => Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.red.withOpacity(0.08),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.red.withOpacity(0.3)),
      ),
      child: Row(children: [
        const Icon(Icons.android, color: Colors.redAccent, size: 36),
        const SizedBox(width: 12),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(app['name'] ?? app['package'], style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          Text('Xavf: ${app['riskScore'] ?? app['risk'] ?? '?'}% — ${app['status'] ?? 'XAVFLI'}',
              style: const TextStyle(color: Colors.orange, fontSize: 12)),
        ])),
        ElevatedButton(
          style: ElevatedButton.styleFrom(backgroundColor: Colors.red, minimumSize: const Size(80, 34)),
          onPressed: () {
            controller.riskAppsList.remove(app);
            Get.snackbar('✅', '${app['name']} o\'chirildi', backgroundColor: Colors.red.withOpacity(0.8));
          },
          child: const Text('O\'chirish', style: TextStyle(fontSize: 12, color: Colors.white)),
        ),
      ]),
    )).toList());
  }

  Widget _buildAlertsFeed() {
    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: controller.alerts.length,
      itemBuilder: (_, i) => Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        decoration: BoxDecoration(
          color: Colors.red.withOpacity(0.06),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.red.withOpacity(0.2)),
        ),
        child: Row(children: [
          const Icon(Icons.error_outline, color: Colors.redAccent, size: 20),
          const SizedBox(width: 10),
          Expanded(child: Text(controller.alerts[i], style: const TextStyle(color: Colors.white70, fontSize: 13))),
        ]),
      ),
    );
  }
}

// Custom Painter for circular score ring
class _ScoreRingPainter extends CustomPainter {
  final double progress;
  final Color color;
  _ScoreRingPainter(this.progress, this.color);

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2 - 12;
    final strokeWidth = 14.0;

    // Background ring
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      -math.pi / 2, 2 * math.pi, false,
      Paint()..color = const Color(0xFF1E2D45)..style = PaintingStyle.stroke..strokeWidth = strokeWidth..strokeCap = StrokeCap.round,
    );

    // Progress ring
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      -math.pi / 2, 2 * math.pi * progress, false,
      Paint()..color = color..style = PaintingStyle.stroke..strokeWidth = strokeWidth..strokeCap = StrokeCap.round
        ..maskFilter = MaskFilter.blur(BlurStyle.normal, 6),
    );
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      -math.pi / 2, 2 * math.pi * progress, false,
      Paint()..color = color..style = PaintingStyle.stroke..strokeWidth = strokeWidth..strokeCap = StrokeCap.round,
    );
  }

  @override
  bool shouldRepaint(_ScoreRingPainter old) => old.progress != progress || old.color != color;
}
