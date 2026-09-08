"use client";

import { useEffect, useState } from "react";
import { Calendar, Check, Copy01 as Copy, Loading01 as Loader2, Plus, RefreshCcw01 as RefreshCw, Save01 as Save, Send01 as Send, Settings01 as Settings, Shield02 as ShieldAlert, ShieldTick as ShieldCheck, Stars01 as Sparkles, User01 as User, Users01 as Users, XClose as X } from "@untitledui/icons";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

const branches = ["CSE", "IT", "ECE", "EEE", "ME", "CE", "Other"];
const years = [1, 2, 3, 4];

export default function SettingsPage() {
  const { user, logout } = useAuth();
  
  // Profile form states
  const [name, setName] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState<number>(1);
  const [telegramUsername, setTelegramUsername] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [newSubject, setNewSubject] = useState("");

  // System states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [checkingCalendar, setCheckingCalendar] = useState(true);

  // Telegram Notifications state
  const [telegramConnected, setTelegramConnected] = useState(false);
  const [checkingTelegram, setCheckingTelegram] = useState(true);
  const [telegramData, setTelegramData] = useState<{
    chat_id?: string | number | null;
    username?: string | null;
    link_code?: string;
    deep_link?: string;
    bot_username?: string;
  } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  
  const [joinedGroups, setJoinedGroups] = useState<{ id: string; name: string; telegram_chat_id: number; created_at: string }[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setBranch(user.branch || "");
      setYear(user.year || 1);
      setTelegramUsername(user.telegram_username || "");
      setSubjects(user.subjects || []);
      setLoading(false);
      
      // Check Google Calendar connection status
      api.get<{ connected: boolean }>("/api/auth/google/status")
        .then((res) => setCalendarConnected(res.connected))
        .catch(() => setCalendarConnected(false))
        .finally(() => setCheckingCalendar(false));

      // Fetch joined groups
      api.get<{ groups: any[] }>("/api/groups/my-groups")
        .then((res) => setJoinedGroups(res.groups || []))
        .catch(() => setJoinedGroups([]))
        .finally(() => setLoadingGroups(false));

      // Fetch Telegram status
      fetchTelegramStatus();
    }
  }, [user]);

  const fetchTelegramStatus = async () => {
    setCheckingTelegram(true);
    try {
      const res = await api.get<{
        connected: boolean;
        chat_id?: string | number | null;
        username?: string | null;
        link_code?: string;
        deep_link?: string;
        bot_username?: string;
      }>("/api/telegram/status");
      setTelegramConnected(Boolean(res.connected));
      setTelegramData(res);
      if (res.connected && res.username) {
        setTelegramUsername(res.username);
      } else {
        setTelegramUsername("");
      }
    } catch {
      setTelegramConnected(false);
    } finally {
      setCheckingTelegram(false);
    }
  };

  const handleCopyCode = () => {
    if (telegramData?.link_code) {
      navigator.clipboard.writeText(telegramData.link_code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleSendTest = async () => {
    setError("");
    setSuccessMsg("");
    setSendingTest(true);
    try {
      await api.post("/api/telegram/test-notification", {});
      setSuccessMsg("Test notification sent to your Telegram!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send test notification");
    } finally {
      setSendingTest(false);
    }
  };

  const handleUnlinkTelegram = async () => {
    setError("");
    setSuccessMsg("");
    try {
      await api.post("/api/telegram/unlink", {});
      setSuccessMsg("Telegram account unlinked successfully");
      await fetchTelegramStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to unlink Telegram");
    }
  };

  const handleConnectCalendar = async () => {
    if (!user) return;
    setError("");
    try {
      // Pass the student ID as state parameter to secure per-user calendar linking
      const res = await api.get<{ url: string }>(`/api/auth/google/url?state=${user.id}`);
      window.location.href = res.url;
    } catch (err) {
      setError("Failed to generate Google Calendar link URL");
    }
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) return;
    const normalized = newSubject.trim().toUpperCase();
    if (!subjects.includes(normalized)) {
      setSubjects([...subjects, normalized]);
    }
    setNewSubject("");
  };

  const handleRemoveSubject = (sub: string) => {
    setSubjects(subjects.filter((s) => s !== sub));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("UniKit_token");
      const res = await api.put<{ student: typeof user }>("/api/auth/me", {
        name: name.trim(),
        branch,
        year,
        subjects
      }, { token: token || undefined });
      
      // Update local storage/context user details if needed by refreshing
      setSuccessMsg("Profile details updated successfully!");
      setTimeout(() => {
        // Trigger page refresh to reload auth details
        window.location.reload();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile details");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
        <p className="text-sm text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">Manage profile, integrations, and synced services</p>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-[10px] text-sm text-destructive animate-in fade-in duration-200">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-[10px] text-sm text-green-600 animate-in fade-in duration-200">
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Integrations (Calendar Link) */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white border border-border rounded-[10px] p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-foreground text-base flex items-center gap-2 border-b border-border pb-3">
              <Calendar className="w-4 h-4 text-primary" />
              Integrations
            </h3>
            
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Connect your Google account to sync assignments with your personal Google Calendar automatically.
              </p>

              {checkingCalendar ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  Checking connection...
                </div>
              ) : calendarConnected ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-[10px] text-green-700 text-sm">
                    <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                    <span className="font-semibold">Calendar Synced</span>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    All set! New deadlines with Sync checked will populate in Google Calendar.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-[10px] text-destructive text-sm">
                    <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                    <span className="font-semibold">Not Connected</span>
                  </div>
                  <button
                    onClick={handleConnectCalendar}
                    className="w-full py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-[10px] hover:opacity-90 transition-standard cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Sparkles className="w-4 h-4" />
                    Sync Google Calendar
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Telegram Notifications Card */}
          <div className="bg-white border border-border rounded-[10px] p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-foreground text-base flex items-center gap-2 border-b border-border pb-3">
              <Send className="w-4 h-4 text-primary" />
              Telegram Notifications
            </h3>

            <div className="space-y-3">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Connect your Telegram account to receive task and deadline reminder alerts.
              </p>

              {checkingTelegram ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  Checking Telegram link...
                </div>
              ) : telegramConnected ? (
                <div className="space-y-3">
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-[10px] text-green-700 text-sm">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 flex-shrink-0 text-green-600" />
                      <div>
                        <span className="font-semibold block">Telegram Connected</span>
                        {telegramData?.username && (
                          <span className="text-xs text-green-800 font-medium">@{telegramData.username}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Reminders for tasks will be delivered directly to your Telegram chat.
                  </p>

                  <div className="space-y-2 pt-1">
                    <button
                      type="button"
                      onClick={handleSendTest}
                      disabled={sendingTest}
                      className="w-full py-2 px-3 bg-muted text-foreground text-xs font-semibold rounded-[10px] hover:bg-accent border border-border transition-standard cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {sendingTest ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Sending test alert...
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5 text-primary" />
                          Send Test Alert
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleUnlinkTelegram}
                      className="w-full py-1.5 px-3 text-destructive hover:bg-destructive/10 text-xs font-medium rounded-[10px] transition-standard cursor-pointer text-center"
                    >
                      Disconnect Telegram
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-[10px] text-destructive text-sm">
                    <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                    <span className="font-semibold">Not Linked</span>
                  </div>

                  {telegramData?.deep_link && (
                    <a
                      href={telegramData.deep_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-[10px] hover:opacity-90 transition-standard cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Send className="w-4 h-4" />
                      Open Telegram Bot
                    </a>
                  )}

                  {telegramData?.link_code && (
                    <div className="bg-background border border-border rounded-[10px] p-3 space-y-2">
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>Verification Code:</span>
                        <span className="font-mono text-[10px]">@{telegramData.bot_username || "UniKitBot"}</span>
                      </div>
                      <div className="flex items-center justify-between bg-white px-3 py-1.5 border border-border rounded-[8px]">
                        <code className="text-xs font-mono font-bold text-foreground">
                          {telegramData.link_code}
                        </code>
                        <button
                          type="button"
                          onClick={handleCopyCode}
                          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          {copiedCode ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-green-600" />
                              <span className="text-[11px] text-green-600 font-medium">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span className="text-[11px]">Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Send <span className="font-mono font-semibold">/link {telegramData.link_code}</span> to our bot to verify.
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={fetchTelegramStatus}
                    className="w-full py-2 px-3 border border-border hover:bg-muted text-foreground text-xs font-medium rounded-[10px] transition-standard cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
                    Check Verification
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Joined Groups Card */}
          <div className="bg-white border border-border rounded-[10px] p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-foreground text-base flex items-center gap-2 border-b border-border pb-3">
              <Users className="w-4 h-4 text-primary" />
              Joined Classes
            </h3>
              
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {loadingGroups ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  </div>
                ) : joinedGroups.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic text-center p-4">No groups joined yet.</p>
                ) : (
                  joinedGroups.map(g => (
                    <div key={g.id} className="p-3 bg-background border border-border rounded-[10px] shadow-sm">
                      <div className="font-semibold text-sm text-foreground mb-1">{g.name}</div>
                      <div className="text-xs text-muted-foreground font-mono truncate">Chat ID: {g.telegram_chat_id}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        {/* Right Side: Profile Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-border rounded-[10px] p-6 shadow-sm space-y-6">
            <h3 className="font-semibold text-foreground text-base flex items-center gap-2 border-b border-border pb-3">
              <User className="w-4 h-4 text-primary" />
              Student Profile
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wider">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wider">
                    Email (Read-only)
                  </label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    className="w-full px-3 py-2 border border-border rounded-[10px] text-sm bg-muted text-muted-foreground cursor-not-allowed"
                    disabled
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wider">
                    Branch
                  </label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-white"
                  >
                    <option value="">Select</option>
                    {branches.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wider">
                    Year of Study
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-white"
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>Year {y}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wider">
                  Telegram Identity
                </label>
                <div className="relative">
                  {telegramUsername ? (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-mono">@</span>
                  ) : telegramConnected ? (
                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                  ) : (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-mono">@</span>
                  )}
                  <input
                    type="text"
                    value={telegramUsername ? telegramUsername.replace(/^@/, "") : (telegramConnected ? "Linked (Private)" : "")}
                    disabled
                    className={`w-full pl-8 pr-3 py-2 border border-border rounded-[10px] text-sm bg-muted cursor-not-allowed font-medium ${telegramConnected && !telegramUsername ? 'text-green-700' : 'text-muted-foreground'}`}
                    placeholder="Not linked"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  This field is synced automatically when you connect your Telegram account below.
                </p>
              </div>

              {/* Subjects tags manager */}
              <div className="border-t border-border pt-4">
                <label className="block text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">
                  Subjects/Courses List
                </label>
                
                {/* Current tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {subjects.map((sub) => (
                    <span 
                      key={sub}
                      className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 bg-primary/5 text-primary border border-primary/10 text-xs font-bold rounded-full"
                    >
                      {sub}
                      <button
                        type="button"
                        onClick={() => handleRemoveSubject(sub)}
                        className="p-0.5 hover:bg-primary/10 rounded-full cursor-pointer text-primary"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {subjects.length === 0 && (
                    <span className="text-xs text-muted-foreground italic py-1">No subjects listed yet. Add your courses below.</span>
                  )}
                </div>

                {/* Add subject input bar */}
                <div className="flex gap-2 max-w-sm">
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="e.g., DBMS"
                    className="flex-1 px-3 py-1.5 border border-border rounded-[10px] text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubject}
                    className="px-3 py-1.5 bg-muted text-foreground border border-border hover:bg-accent rounded-[10px] text-xs font-medium cursor-pointer flex items-center gap-1 transition-standard"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add
                  </button>
                </div>
              </div>

              <div className="flex justify-end border-t border-border pt-4 mt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-semibold rounded-[10px] hover:opacity-90 transition-standard cursor-pointer disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Profile Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 border border-red-200 rounded-[10px] p-6 shadow-sm space-y-4">
            <h3 className="font-semibold text-red-700 text-base flex items-center gap-2 border-b border-red-200 pb-3">
              Danger Zone
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-red-900">Delete Account and My Data</p>
                <p className="text-xs text-red-700 mt-1 max-w-md">
                  Once you delete your account, there is no going back. All your tasks, attendance, notes, and profile data will be permanently wiped.
                </p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  if (confirm("Are you absolutely sure you want to delete your account? This action cannot be undone.")) {
                    try {
                      await api.delete("/api/auth/me");
                      logout();
                    } catch (err) {
                      alert("Failed to delete account: " + (err instanceof Error ? err.message : "Unknown error"));
                    }
                  }
                }}
                className="shrink-0 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-[10px] hover:bg-red-700 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
