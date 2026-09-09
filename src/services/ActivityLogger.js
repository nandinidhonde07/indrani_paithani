class ActivityLogger {
  static KEY = 'indrani_activity_logs';

  static async getLogs() {
    return new Promise((resolve) => {
      const stored = localStorage.getItem(this.KEY);
      resolve(stored ? JSON.parse(stored) : []);
    });
  }

  static async log(action, details, user = 'Owner') {
    const logs = await this.getLogs();
    const newLog = {
      id: String(Date.now()),
      action,
      details,
      user,
      timestamp: new Date().toISOString()
    };
    const updated = [newLog, ...logs].slice(0, 500); // Keep last 500 logs
    localStorage.setItem(this.KEY, JSON.stringify(updated));
    
    // Dispatch custom event to sync across tabs if needed
    window.dispatchEvent(new Event('activity_log_updated'));
    return newLog;
  }
}

export default ActivityLogger;
