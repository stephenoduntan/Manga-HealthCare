import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { sendLocalNotification } from '../../src/services/notifications';

export default function MobileCheckoutScreen() {
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'TRANSFER' | 'USSD'>('CARD');
  const [isFollowup, setIsFollowup] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const standardFee = 10000;
  const followupFee = 5000;
  const currentAmount = isFollowup ? followupFee : standardFee;

  const handleCompletePayment = async () => {
    setIsProcessing(true);

    setTimeout(async () => {
      setIsProcessing(false);
      // Send push notification
      await sendLocalNotification(
        'Booking Confirmed (Paid)',
        `Your consultation payment of ₦${currentAmount.toLocaleString()} has been processed via Paystack. A doctor is reviewing your file.`
      );

      // Navigate to consultation room
      router.replace('/(patient-tabs)/consultation/c-session-882');
    }, 1200);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Consultation Checkout</Text>
      <Text style={styles.subtitle}>Paystack & Flutterwave Secure Payment</Text>

      {/* Pricing Summary Card */}
      <View style={styles.pricingCard}>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Consultation Type</Text>
          <Text style={styles.priceValue}>General Practice Telehealth</Text>
        </View>

        <TouchableOpacity
          style={styles.followupToggle}
          onPress={() => setIsFollowup(!isFollowup)}
        >
          <View style={[styles.radio, isFollowup && styles.radioActive]} />
          <View style={{ flex: 1 }}>
            <Text style={styles.followupText}>14-Day Clinical Follow-up</Text>
            <Text style={styles.followupSubtext}>50% discount applies if seen within 14 days</Text>
          </View>
          <Text style={styles.discountBadge}>-50%</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <View style={styles.priceRow}>
          <Text style={styles.totalLabel}>Total Payable</Text>
          <Text style={styles.totalAmount}>₦{currentAmount.toLocaleString()}</Text>
        </View>
      </View>

      {/* Payment Method Selector */}
      <Text style={styles.sectionHeader}>Select Payment Method:</Text>
      <View style={styles.methodsRow}>
        <TouchableOpacity
          style={[styles.methodCard, paymentMethod === 'CARD' && styles.methodCardActive]}
          onPress={() => setPaymentMethod('CARD')}
        >
          <Text style={{ fontSize: 20 }}>💳</Text>
          <Text style={styles.methodLabel}>Debit Card</Text>
          <Text style={styles.methodSubtext}>Instant</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.methodCard, paymentMethod === 'TRANSFER' && styles.methodCardActive]}
          onPress={() => setPaymentMethod('TRANSFER')}
        >
          <Text style={{ fontSize: 20 }}>🏦</Text>
          <Text style={styles.methodLabel}>Bank Transfer</Text>
          <Text style={styles.methodSubtext}>Virtual Acct</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.methodCard, paymentMethod === 'USSD' && styles.methodCardActive]}
          onPress={() => setPaymentMethod('USSD')}
        >
          <Text style={{ fontSize: 20 }}>📱</Text>
          <Text style={styles.methodLabel}>USSD Dial</Text>
          <Text style={styles.methodSubtext}>*737# / *894#</Text>
        </TouchableOpacity>
      </View>

      {paymentMethod === 'USSD' && (
        <View style={styles.ussdDetails}>
          <Text style={styles.ussdTitle}>Dial to Pay ₦{currentAmount.toLocaleString()}:</Text>
          <Text style={styles.ussdCode}>*737*000*4829# (GTBank)</Text>
          <Text style={styles.ussdCode}>*894*000*4829# (FirstBank)</Text>
        </View>
      )}

      {/* Security Notice */}
      <View style={styles.securityBox}>
        <Text style={styles.securityText}>
          🔒 256-Bit Encrypted. Regulated by Central Bank of Nigeria (CBN). Consultation fee is held in escrow until session completion.
        </Text>
      </View>

      {/* Pay CTA */}
      <TouchableOpacity
        style={styles.payButton}
        onPress={handleCompletePayment}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.payButtonText}>Pay ₦{currentAmount.toLocaleString()} & Connect</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f8f3eb',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#080331',
  },
  subtitle: {
    fontSize: 13,
    color: '#747679',
    marginTop: 2,
    marginBottom: 20,
  },
  pricingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#efeeeb',
    marginBottom: 24,
    gap: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 13,
    color: '#747679',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#080331',
  },
  followupToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#e1f4df',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#b1dbb8',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#0f3e17',
  },
  radioActive: {
    backgroundColor: '#0f3e17',
  },
  followupText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f3e17',
  },
  followupSubtext: {
    fontSize: 11,
    color: '#0f3e17',
    opacity: 0.8,
  },
  discountBadge: {
    backgroundColor: '#31ce01',
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  divider: {
    height: 1,
    backgroundColor: '#efeeeb',
    marginVertical: 4,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#080331',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f3e17',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#080331',
    marginBottom: 10,
  },
  methodsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  methodCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#efeeeb',
    alignItems: 'center',
    gap: 4,
  },
  methodCardActive: {
    borderColor: '#0f3e17',
    backgroundColor: '#e1f4df',
  },
  methodLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#080331',
  },
  methodSubtext: {
    fontSize: 10,
    color: '#747679',
  },
  ussdDetails: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#efeeeb',
    marginBottom: 16,
    gap: 6,
  },
  ussdTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#080331',
  },
  ussdCode: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#ff643b',
    fontWeight: '700',
  },
  securityBox: {
    backgroundColor: 'rgba(8, 3, 49, 0.04)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  securityText: {
    fontSize: 11,
    color: '#747679',
    lineHeight: 16,
    textAlign: 'center',
  },
  payButton: {
    backgroundColor: '#0f3e17',
    paddingVertical: 16,
    borderRadius: 9999,
    alignItems: 'center',
    shadowColor: '#4b4439',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  payButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
