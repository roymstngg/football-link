import 'package:flutter_test/flutter_test.dart';
import 'package:futboll_flutter/main.dart';

void main() {
  testWidgets('App load test', (WidgetTester tester) async {
    await tester.pumpWidget(const FootballLinkApp());
    expect(find.byType(FootballLinkApp), findsOneWidget);
  });
}
