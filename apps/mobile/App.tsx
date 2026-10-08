import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function App() {
  const [activeNav, setActiveNav] = useState<'home' | 'projects' | 'chat' | 'resources' | 'profile'>('projects');
  const [projectTab, setProjectTab] = useState<'overview' | 'requirements' | 'stack' | 'architecture' | 'roadmap'>('overview');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      text: "Hi! I'm StackMatch. Tell me about the product you want to build. You can describe it in simple words — I'll take care of the technical details.",
    },
    {
      id: '2',
      role: 'user',
      text: 'I want to build a food ordering platform for my college.',
    },
    {
      id: '3',
      role: 'assistant',
      text: "That's a great idea! Who will use the platform — students, restaurants, or college admins? Also, do you need online payments?",
      suggestions: ['Students & Restaurants', 'Both web and mobile', 'Online payments'],
    },
  ]);

  const sendMessage = (textToSend?: string) => {
    const text = textToSend || chatInput;
    if (!text.trim()) return;

    const newMsgs = [
      ...messages,
      { id: Date.now().toString(), role: 'user', text },
    ];
    setMessages(newMsgs);
    setChatInput('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: 'Understood! I updated the project requirements with role-based authentication, menu browsing, and secure payments via PostgreSQL and Razorpay.',
          suggestions: ['View Requirements', 'Explore Tech Stack', 'View Architecture'],
        },
      ]);
    }, 600);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>SM</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>StackMatch</Text>
            <Text style={styles.headerSubtitle}>College Food Ordering Platform</Text>
          </View>
        </View>
        <View style={styles.stagePill}>
          <Text style={styles.stagePillText}>Stage 3: Planning</Text>
        </View>
      </View>

      {/* Project Sub-tabs (when in projects view) */}
      {activeNav === 'projects' && (
        <View style={styles.tabBarContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.subTabBar}>
            {(['overview', 'requirements', 'stack', 'architecture', 'roadmap'] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setProjectTab(tab)}
                style={[styles.subTabItem, projectTab === tab && styles.subTabItemActive]}
              >
                <Text style={[styles.subTabItemText, projectTab === tab && styles.subTabItemTextActive]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Main Content Area */}
      <View style={styles.mainContent}>
        {activeNav === 'chat' && (
          <KeyboardAvoidingView
            style={styles.chatContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView contentContainerStyle={styles.messagesList}>
              {messages.map((m) => (
                <View
                  key={m.id}
                  style={[
                    styles.messageBubble,
                    m.role === 'user' ? styles.userBubble : styles.assistantBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      m.role === 'user' ? styles.userMessageText : styles.assistantMessageText,
                    ]}
                  >
                    {m.text}
                  </Text>
                  {m.suggestions && (
                    <View style={styles.suggestionsContainer}>
                      {m.suggestions.map((s, idx) => (
                        <TouchableOpacity
                          key={idx}
                          style={styles.suggestionChip}
                          onPress={() => sendMessage(s)}
                        >
                          <Text style={styles.suggestionChipText}>{s}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>

            <View style={styles.chatInputRow}>
              <TextInput
                style={styles.chatTextInput}
                placeholder="Describe your idea..."
                placeholderTextColor="#9CA3AF"
                value={chatInput}
                onChangeText={setChatInput}
                onSubmitEditing={() => sendMessage()}
              />
              <TouchableOpacity style={styles.sendButton} onPress={() => sendMessage()}>
                <Text style={styles.sendButtonText}>↑</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        )}

        {activeNav === 'projects' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {projectTab === 'overview' && (
              <View style={styles.cardGroup}>
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Project Summary</Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>Type:</Text>
                    <Text style={styles.metaValue}>Web + Mobile Application</Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>Users:</Text>
                    <Text style={styles.metaValue}>Students, Restaurants, Admin</Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>Timeline:</Text>
                    <Text style={styles.metaValue}>3–6 months</Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>Complexity:</Text>
                    <Text style={styles.metaValue}>Medium</Text>
                  </View>
                </View>

                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Project Goals</Text>
                  <Text style={styles.bulletItem}>✓ Easy food ordering for students</Text>
                  <Text style={styles.bulletItem}>✓ Help restaurants manage lunch spikes</Text>
                  <Text style={styles.bulletItem}>✓ Seamless UPI and card payment flow</Text>
                  <Text style={styles.bulletItem}>✓ Scalable multi-campus architecture</Text>
                </View>
              </View>
            )}

            {projectTab === 'requirements' && (
              <View style={styles.cardGroup}>
                {[
                  { title: 'User Management', desc: 'Students, restaurants and admins can register & login.', priority: 'HIGH' },
                  { title: 'Food Ordering', desc: 'Browse menus, cart management, and order placement.', priority: 'HIGH' },
                  { title: 'Restaurant Management', desc: 'Update menus and manage incoming orders in real time.', priority: 'HIGH' },
                  { title: 'Payment Integration', desc: 'Online UPI and cards with instant receipts.', priority: 'HIGH' },
                  { title: 'Notifications', desc: 'Order status updates & alerts for meal pickup.', priority: 'MED' },
                ].map((req, idx) => (
                  <View key={idx} style={styles.card}>
                    <View style={styles.cardHeaderRow}>
                      <Text style={styles.cardItemTitle}>{req.title}</Text>
                      <View style={styles.badgeDanger}>
                        <Text style={styles.badgeDangerText}>{req.priority}</Text>
                      </View>
                    </View>
                    <Text style={styles.cardItemDesc}>{req.desc}</Text>
                  </View>
                ))}
              </View>
            )}

            {projectTab === 'stack' && (
              <View style={styles.cardGroup}>
                {[
                  { name: 'React', category: 'Frontend', match: '94% Match', desc: 'Interactive web UI for cafeteria browsing.' },
                  { name: 'Node.js', category: 'Backend', match: '92% Match', desc: 'Fast asynchronous API gateway.' },
                  { name: 'PostgreSQL', category: 'Database', match: '94% Match', desc: 'ACID transactions for student orders.' },
                  { name: 'Razorpay', category: 'Payments', match: '90% Match', desc: 'Instant UPI and card checkout.' },
                  { name: 'Docker', category: 'Deployment', match: '90% Match', desc: 'Reliable containerized deployment.' },
                ].map((tech, idx) => (
                  <View key={idx} style={styles.card}>
                    <View style={styles.cardHeaderRow}>
                      <View>
                        <Text style={styles.techCategory}>{tech.category.toUpperCase()}</Text>
                        <Text style={styles.cardItemTitle}>{tech.name}</Text>
                      </View>
                      <View style={styles.badgeDark}>
                        <Text style={styles.badgeDarkText}>{tech.match}</Text>
                      </View>
                    </View>
                    <Text style={styles.cardItemDesc}>{tech.desc}</Text>
                  </View>
                ))}
              </View>
            )}

            {projectTab === 'architecture' && (
              <View style={styles.cardGroup}>
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Client Tier</Text>
                  <Text style={styles.bulletItem}>• React Web Application</Text>
                  <Text style={styles.bulletItem}>• React Native Mobile Client</Text>
                </View>
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Backend Services</Text>
                  <Text style={styles.bulletItem}>• Node.js + Express API Gateway</Text>
                  <Text style={styles.bulletItem}>• JWT Role Authorization</Text>
                </View>
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Data & Gateways</Text>
                  <Text style={styles.bulletItem}>• PostgreSQL Relational Database</Text>
                  <Text style={styles.bulletItem}>• Razorpay UPI Payment Gateway</Text>
                </View>
              </View>
            )}

            {projectTab === 'roadmap' && (
              <View style={styles.cardGroup}>
                {[
                  { phase: 'Phase 1: Foundation', time: '2–3 weeks', items: ['Project setup', 'Auth & JWT', 'DB Schema'] },
                  { phase: 'Phase 2: Core Features', time: '4–6 weeks', items: ['Menu browsing', 'Cart & Orders', 'Payments'] },
                  { phase: 'Phase 3: Advanced Features', time: '3–4 weeks', items: ['Live tracking', 'Push notifications'] },
                  { phase: 'Phase 4: Testing & Deploy', time: '2–3 weeks', items: ['Stress tests', 'Cloud deployment'] },
                ].map((ph, idx) => (
                  <View key={idx} style={styles.card}>
                    <View style={styles.cardHeaderRow}>
                      <Text style={styles.cardItemTitle}>{ph.phase}</Text>
                      <Text style={styles.phaseTimeText}>{ph.time}</Text>
                    </View>
                    {ph.items.map((it, i) => (
                      <Text key={i} style={styles.bulletItem}>✓ {it}</Text>
                    ))}
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        )}

        {activeNav === 'home' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.heroCard}>
              <Text style={styles.heroTitle}>Turn your idea into a build-ready blueprint.</Text>
              <Text style={styles.heroDesc}>
                Discuss your idea, understand requirements, choose technology, and create a clear plan.
              </Text>
              <TouchableOpacity
                style={styles.heroButton}
                onPress={() => setActiveNav('chat')}
              >
                <Text style={styles.heroButtonText}>Start Planning Now →</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {activeNav === 'resources' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {[
              { title: 'React Documentation', cat: 'Official Docs', desc: 'Modern component fundamentals.' },
              { title: 'Node.js Express Guide', cat: 'Guide', desc: 'Scalable RESTful API architecture.' },
              { title: 'PostgreSQL Relational Design', cat: 'Tutorial', desc: 'ACID data consistency for orders.' },
            ].map((r, idx) => (
              <View key={idx} style={styles.card}>
                <Text style={styles.techCategory}>{r.cat}</Text>
                <Text style={styles.cardItemTitle}>{r.title}</Text>
                <Text style={styles.cardItemDesc}>{r.desc}</Text>
              </View>
            ))}
          </ScrollView>
        )}

        {activeNav === 'profile' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Founder Profile</Text>
              <Text style={styles.metaLabel}>Name: Alex Rivera</Text>
              <Text style={styles.metaLabel}>Email: demo@stackmatch.dev</Text>
              <Text style={styles.metaLabel}>Role: Founder / Product Planner</Text>
            </View>
          </ScrollView>
        )}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {[
          { id: 'home', label: 'Home' },
          { id: 'projects', label: 'Projects' },
          { id: 'chat', label: 'Chat' },
          { id: 'resources', label: 'Resources' },
          { id: 'profile', label: 'Profile' },
        ].map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => setActiveNav(item.id as any)}
            style={styles.bottomNavItem}
          >
            <Text
              style={[
                styles.bottomNavText,
                activeNav === item.id && styles.bottomNavTextActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadgeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#687280',
  },
  stagePill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  stagePillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#374151',
  },
  tabBarContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  subTabBar: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  subTabItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  subTabItemActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  subTabItemText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#687280',
  },
  subTabItemTextActive: {
    color: '#FFFFFF',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  cardGroup: {
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardItemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  cardItemDesc: {
    fontSize: 12,
    color: '#687280',
    lineHeight: 18,
  },
  techCategory: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#9CA3AF',
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  metaLabel: {
    fontSize: 12,
    color: '#687280',
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  bulletItem: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 20,
  },
  badgeDanger: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeDangerText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#991B1B',
  },
  badgeDark: {
    backgroundColor: '#111827',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeDarkText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  phaseTimeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#687280',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  messagesList: {
    padding: 16,
    gap: 12,
  },
  messageBubble: {
    padding: 14,
    borderRadius: 14,
    maxWidth: '85%',
  },
  assistantBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignSelf: 'flex-start',
  },
  userBubble: {
    backgroundColor: '#111827',
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 13,
    lineHeight: 19,
  },
  assistantMessageText: {
    color: '#111827',
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  suggestionChip: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  suggestionChipText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#374151',
  },
  chatInputRow: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 8,
  },
  chatTextInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 13,
    color: '#111827',
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 20,
    alignItems: 'center',
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroDesc: {
    fontSize: 13,
    color: '#687280',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  heroButton: {
    backgroundColor: '#111827',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  heroButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
  },
  bottomNavItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomNavText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#687280',
  },
  bottomNavTextActive: {
    color: '#111827',
    fontWeight: 'bold',
  },
});
