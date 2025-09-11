import { useEffect, useState } from "react";
import api from "../lib/api";
import type { AxiosError, AxiosResponse } from "axios";

type Me = {
  _id: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};

type ApiResponse<T> = { message?: string; data?: T };

export default function Settings() {
  const token = localStorage.getItem("adminToken") || "";

  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const [profile, setProfile] = useState<Partial<Me>>({});
  const [pwd, setPwd] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [testTo, setTestTo] = useState("");

  const [busyProfile, setBusyProfile] = useState(false);
  const [busyPwd, setBusyPwd] = useState(false);
  const [busyEmail, setBusyEmail] = useState(false);

  function toastSuccess(msg: string) {
    setOk(msg);
    setErr("");
    setTimeout(() => setOk(""), 2500);
  }
  function toastError(msg: string) {
    setErr(msg);
    setOk("");
    setTimeout(() => setErr(""), 4000);
  }

  useEffect(() => {
    if (!token) {
      setErr("No token; please login.");
      setLoading(false);
      return;
    }

    api
      .get<ApiResponse<Me> | Me>("/admin/profile")
      .then((r: AxiosResponse<ApiResponse<Me> | Me>) => {
        // Support both { data: Me } and raw Me responses
        const payload = r.data as any;
        const data: Me = (payload && "data" in payload ? payload.data : payload) as Me;

        setMe(data);
        setProfile({
          firstName: data?.firstName || "",
          lastName: data?.lastName || "",
          phone: data?.phone || "",
        });
      })
      .catch((e: AxiosError<any>) => {
        const msg =
          (e.response?.data as any)?.message ||
          e.message ||
          "Failed to load profile";
        toastError(msg);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const saveProfile = async () => {
    setBusyProfile(true);
    try {
      await api.put("/admin/profile", profile);
      setMe((m) => (m ? ({ ...m, ...profile } as Me) : m));
      toastSuccess("Profile updated");
    } catch (e) {
      const ae = e as AxiosError<any>;
      const msg = ae.response?.data?.message || ae.message || "Failed to update profile";
      toastError(msg);
    } finally {
      setBusyProfile(false);
    }
  };

  const changePassword = async () => {
    if (!pwd.oldPassword || !pwd.newPassword || !pwd.confirmPassword) {
      toastError("Please fill all password fields.");
      return;
    }
    if (pwd.newPassword !== pwd.confirmPassword) {
      toastError("New password and confirmation do not match.");
      return;
    }
    if (pwd.oldPassword === pwd.newPassword) {
      toastError("New password cannot be the same as current password.");
      return;
    }

    setBusyPwd(true);
    try {
      await api.post("/admin/change-password", {
        currentPassword: pwd.oldPassword,
        newPassword: pwd.newPassword,
      });
      setPwd({ oldPassword: "", newPassword: "", confirmPassword: "" });
      toastSuccess("Password changed");
    } catch (e) {
      const ae = e as AxiosError<any>;
      const msg = ae.response?.data?.message || ae.message || "Failed to change password";
      toastError(msg);
    } finally {
      setBusyPwd(false);
    }
  };

  // Optional: only keep if your backend still exposes this route under /admin/auth/test-email
  const sendTestEmail = async () => {
    setBusyEmail(true);
    try {
      const body = testTo ? { to: testTo } : {};
      const r = await api.post<ApiResponse<{ success?: boolean }>>(
        "/admin/auth/test-email",
        body
      );
      const okFlag = (r.data as any)?.success ?? (r.data as any)?.data?.success;
      if (okFlag) toastSuccess("Test email sent");
      else toastError((r.data as any)?.message || "Failed to send");
    } catch (e) {
      const ae = e as AxiosError<any>;
      const status = ae.response?.status;
      if (status === 404) {
        toastError("Test email route not found on backend.");
      } else {
        const msg = ae.response?.data?.message || ae.message || "Failed to send email";
        toastError(msg);
      }
    } finally {
      setBusyEmail(false);
    }
  };

 if (loading) {
  return <div className="p-6">Loading…</div>;
}

if (!me) {
  return (
    <div className="p-6 text-red-600">
      {err || "No profile"}{" "}
      <a className="underline" href="/login">
        Go to login
      </a>
    </div>
  );
}

return (
  <div className="p-6 space-y-6">
    {!!ok && <div className="rounded bg-green-100 text-green-800 px-3 py-2">{ok}</div>}
    {!!err && <div className="rounded bg-red-100 text-red-800 px-3 py-2">{err}</div>}

    {/* Profile */}
    <section className="bg-white shadow rounded p-4 space-y-4">
      <h2 className="text-lg font-semibold">Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">First name</span>
          <input
            className="border rounded px-3 py-2"
            value={profile.firstName || ""}
            onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Last name</span>
          <input
            className="border rounded px-3 py-2"
            value={profile.lastName || ""}
            onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Phone</span>
          <input
            className="border rounded px-3 py-2"
            value={profile.phone || ""}
            onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
          />
        </label>
        <label className="flex flex-col gap-1 opacity-70">
          <span className="text-sm text-gray-600">Email (read-only)</span>
          <input className="border rounded px-3 py-2 bg-gray-50" value={me.email} readOnly />
        </label>
      </div>
      <button
        onClick={saveProfile}
        className="px-4 py-2 rounded bg-black text-white hover:opacity-90 disabled:opacity-60"
        disabled={busyProfile}
      >
        {busyProfile ? "Saving…" : "Save profile"}
      </button>
    </section>

    {/* Password */}
    <section className="bg-white shadow rounded p-4 space-y-4">
      <h2 className="text-lg font-semibold">Change Password</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="password"
          placeholder="Current password"
          className="border rounded px-3 py-2"
          value={pwd.oldPassword}
          onChange={(e) => setPwd((p) => ({ ...p, oldPassword: e.target.value }))}
        />
        <input
          type="password"
          placeholder="New password"
          className="border rounded px-3 py-2"
          value={pwd.newPassword}
          onChange={(e) => setPwd((p) => ({ ...p, newPassword: e.target.value }))}
        />
        <input
          type="password"
          placeholder="Confirm new password"
          className="border rounded px-3 py-2"
          value={pwd.confirmPassword}
          onChange={(e) => setPwd((p) => ({ ...p, confirmPassword: e.target.value }))}
        />
      </div>
      <button
        onClick={changePassword}
        className="px-4 py-2 rounded bg-black text-white hover:opacity-90 disabled:opacity-60"
        disabled={busyPwd}
      >
        {busyPwd ? "Updating…" : "Update password"}
      </button>
    </section>

    {/* Email */}
    <section className="bg-white shadow rounded p-4 space-y-4">
      <h2 className="text-lg font-semibold">Email</h2>
      <div className="flex gap-3 items-center">
        <input
          placeholder="Recipient (optional)"
          className="border rounded px-3 py-2 flex-1"
          value={testTo}
          onChange={(e) => setTestTo(e.target.value)}
        />
        <button
          onClick={sendTestEmail}
          className="px-4 py-2 rounded bg-black text-white hover:opacity-90 disabled:opacity-60"
          disabled={busyEmail}
        >
          {busyEmail ? "Sending…" : "Send test email"}
        </button>
      </div>
    </section>
  </div>
);
}
