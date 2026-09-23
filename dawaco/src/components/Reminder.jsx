import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { FaTrash, FaRegClock, FaCalendarPlus } from "react-icons/fa";

const Reminder = () => {
  const { user, token } = useAuth();
  const [title, setTitle] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Request browser notification permissions on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // Fetch reminders based on auth state
  useEffect(() => {
    const fetchReminders = async () => {
      setLoading(true);
      if (user && token) {
        try {
          const response = await fetch("/api/reminders", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setReminders(data);
          }
        } catch (err) {
          console.error("Failed to fetch reminders:", err);
        } finally {
          setLoading(false);
        }
      } else {
        const saved = JSON.parse(localStorage.getItem("reminders")) || [];
        setReminders(saved);
        setLoading(false);
      }
    };

    fetchReminders();
  }, [user, token]);

  // Keep localStorage in sync for guests
  useEffect(() => {
    if (!user) {
      localStorage.setItem("reminders", JSON.stringify(reminders));
    }
  }, [reminders, user]);

  // Check reminders every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      setReminders((prevReminders) => {
        return prevReminders.map((reminder) => {
          const reminderTime = new Date(reminder.dateTime).getTime();

          // If reminder is due and has not been notified yet
          if (!reminder.notified && now >= reminderTime) {
            const message = `💊 Time to take: ${reminder.title}`;

            // Trigger browser notification
            if ("Notification" in window && Notification.permission === "granted") {
              new Notification("DaWaCo Reminder", {
                body: message,
                icon: "/favicon.ico",
              });
            } else {
              toast.success(message, { duration: 6000 });
            }

            // Sync notification status with backend if logged in
            if (user && token && reminder.id) {
              fetch(`/api/reminders/${reminder.id}/notified`, {
                method: "PUT",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }).catch((e) => console.error("Error setting notified status:", e));
            }

            return { ...reminder, notified: 1 };
          }
          return reminder;
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [user, token]);

  // Add a new reminder
  const addReminder = async () => {
    if (!title || !dateTime) {
      toast.error("Please enter medicine name and date/time!");
      return;
    }

    const nowTime = new Date().getTime();
    const selTime = new Date(dateTime).getTime();
    if (selTime <= nowTime) {
      toast.error("Please select a future time!");
      return;
    }

    if (user && token) {
      try {
        const response = await fetch("/api/reminders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, dateTime }),
        });
        if (response.ok) {
          const newReminder = await response.json();
          setReminders((prev) => [...prev, newReminder]);
          setTitle("");
          setDateTime("");
          toast.success("Reminder set successfully!");
        } else {
          const errData = await response.json();
          throw new Error(errData.message || "Failed to save reminder");
        }
      } catch (err) {
        toast.error(err.message);
      }
    } else {
      // Guest local storage addition
      const newReminder = {
        title,
        dateTime,
        notified: 0,
      };
      setReminders((prev) => [...prev, newReminder]);
      setTitle("");
      setDateTime("");
      toast.success("Reminder set successfully (locally)!");
    }
  };

  // Delete reminder
  const deleteReminder = async (index, id) => {
    if (user && token && id) {
      try {
        const response = await fetch(`/api/reminders/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          setReminders((prev) => prev.filter((r) => r.id !== id));
          toast.success("Reminder deleted!");
        } else {
          toast.error("Failed to delete reminder");
        }
      } catch (err) {
        toast.error("Error deleting reminder");
      }
    } else {
      // Guest local delete
      const updated = [...reminders];
      updated.splice(index, 1);
      setReminders(updated);
      toast.success("Reminder deleted!");
    }
  };

  return (
    <div className="max-w-xl mx-auto my-10 p-6 md:p-8 bg-white border border-gray-200 shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
        <FaRegClock className="text-blue-600" /> Medicine Reminders
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Medicine Name
          </label>
          <input
            type="text"
            placeholder="E.g. Paracetamol 650mg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Dosage Time
          </label>
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>
      </div>

      <button
        onClick={addReminder}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 active:scale-[0.98]"
      >
        <FaCalendarPlus /> Add Reminder
      </button>

      {user && (
        <p className="text-[10px] text-gray-400 mt-2 text-center">
          ✓ Syncing live with your DaWaCo cloud profile
        </p>
      )}

      {/* Reminder List */}
      <div className="mt-8 border-t border-gray-100 pt-6">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
          Active Schedule
        </h3>

        {loading ? (
          <div className="text-center py-6 text-gray-400">Loading schedule...</div>
        ) : reminders.length === 0 ? (
          <div className="text-center py-8 border rounded-xl bg-gray-50 text-gray-400 text-sm">
            No reminders configured. Set one above!
          </div>
        ) : (
          <ul className="space-y-3">
            {reminders.map((reminder, index) => (
              <li
                key={reminder.id || index}
                className={`flex justify-between items-center border border-gray-100 rounded-xl p-4 transition duration-300 bg-white hover:border-gray-300 ${
                  reminder.notified ? "bg-gray-50 opacity-75" : ""
                }`}
              >
                <div>
                  <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                    {reminder.title}
                    {reminder.notified ? (
                      <span className="bg-green-100 text-green-700 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                        Taken
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-700 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                        Scheduled
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(reminder.dateTime).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
                <button
                  onClick={() => deleteReminder(index, reminder.id)}
                  className="text-gray-400 hover:text-red-600 transition p-2 hover:bg-red-50 rounded-lg"
                  title="Delete Reminder"
                >
                  <FaTrash size={12} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Toaster position="top-right" />
    </div>
  );
};

export default Reminder;
