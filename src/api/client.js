// Mock Supabase client for offline/local demo mode.
// This replaces the live Supabase connection and stores data in localStorage.

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const LOCAL_DB_KEY = "razr_demo_db_v1";

// Helper to load/save tables from localStorage
function getDb() {
  let db = null;
  try {
    const data = localStorage.getItem(LOCAL_DB_KEY);
    if (data) db = JSON.parse(data);
  } catch (e) {
    console.error("Failed to parse local DB:", e);
  }

  if (!db) {
    db = initializeDefaultDb();
  }
  return db;
}

function saveDb(db) {
  try {
    localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(db));
  } catch (e) {
    console.error("Failed to save local DB:", e);
  }
}

function initializeDefaultDb() {
  const db = {
    staff: [],
    led_models: [],
    controllers: [],
    accessories: [],
    led_projects: [],
    led_inventory: [],
    led_transactions: [],
    project_reports: [],
    service_requests: []
  };

  // 1. Populate staff from window.STAFF_DATA
  if (window.STAFF_DATA && Object.keys(window.STAFF_DATA).length > 0) {
    db.staff = Object.values(window.STAFF_DATA);
  }
  
  // Ensure fallback admin is always registered
  if (!db.staff.some(s => s.username === 'admin')) {
    db.staff.push({ id: "1", username: "admin", password: "1234", email: "admin@razr.com", phone: "0800000000", emp_id: "HR-MK-4-025", name: "นาย ดำรง สูงเรือง", nick: "ดำ", role: "admin", status: "active" });
  }

  // 2. Populate led_models, controllers, accessories from window.DEFAULT_DATA
  if (window.DEFAULT_DATA) {
    // Flatten led_models from groups (UIR, UOS, CIH)
    ["UIR", "UOS", "CIH"].forEach(g => {
      const group = window.DEFAULT_DATA[g];
      if (group && group.items) {
        group.items.forEach(item => {
          db.led_models.push({
            id: item.id || generateUUID(),
            group_id: g,
            model_name: item.name,
            name: item.name, // Support both name formats
            resolution_width: item.rw || 0,
            resolution_height: item.rh || 0,
            cabinet_w_width: item.w || group.w,
            cabinet_h_height: item.h || group.h,
            weight_kg: item.weight || group.weight,
            max_power_w: item.max || 0,
            avg_power_w: item.avg || 0,
            price_per_sqm: item.price || 0,
            price: item.price || 0,
            brightness_nits: item.brightness || 0,
            refresh_rate_hz: item.refresh_rate || 0,
            material: item.material || "Die-casting Aluminum",
            maintenance: item.maintenance || "Front/Rear Service",
            ip_rating: item.ingress_protection || "IP30",
            led_type: item.led_type || "SMD",
            beam_angle: item.beam_angle || "160°/140°",
            color_temp: item.color_temperature || "6500K",
            grayscale: item.processing_depth || "14-bit",
            life_hours: item.life_hours || 100000,
            frame_rate: item.video_support || "60Hz",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        });
      }
    });

    // Populate controllers
    if (window.DEFAULT_DATA.controllers) {
      db.controllers = window.DEFAULT_DATA.controllers.map(c => ({
        id: c.id || generateUUID(),
        name: c.name,
        load_pixels: c.load || 0,
        price: c.price || 0
      }));
    }

    // Populate accessories
    if (window.DEFAULT_DATA.accessories) {
      db.accessories = window.DEFAULT_DATA.accessories.map(a => ({
        id: a.id || generateUUID(),
        name: a.name,
        price: a.price || 0
      }));
    }
  }

  // 3. Pre-populate sample led_projects
  db.led_projects = [
    {
      id: 1,
      project_id: "PRJ-260619-001",
      project_name: "RAZR LED Board Office Room",
      customer_name: "Chinavut Tech Co.",
      contact_person: "คุณวินัย",
      phone: "081-777-8888",
      location: "Bangkok",
      led_type: "Indoor",
      screen_size: "4x3 cabinets",
      salesperson: "ริน",
      est_value: 150000,
      status: "new",
      notes: "โปรเจคบอร์ดรูมระดับผู้บริหาร ติดตั้งแบบติดผนังปูน",
      created_by: "ริน",
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    {
      id: 2,
      project_id: "PRJ-260619-002",
      project_name: "Outdoor LED Billboard Rama 9",
      customer_name: "Media Group",
      contact_person: "คุณสมศักดิ์",
      phone: "082-999-1111",
      location: "Bangkok",
      led_type: "Outdoor",
      screen_size: "10x5 cabinets",
      salesperson: "ต้น",
      est_value: 850000,
      status: "booking",
      notes: "ป้ายโฆษณากลางแจ้งขนาดใหญ่ บริเวณสี่แยกพระราม 9",
      created_by: "ต้น",
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      at_booking: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 3,
      project_id: "PRJ-260619-003",
      project_name: "Conference Hall Display",
      customer_name: "Grand Hotel",
      contact_person: "คุณกมล",
      phone: "083-222-3333",
      location: "Pattaya",
      led_type: "Indoor",
      screen_size: "8x4.5 cabinets",
      salesperson: "โหน่ง",
      est_value: 420000,
      status: "quotation",
      notes: "จอแสดงผลหลังเวทีประชุมหลัก แขวนกับโครงเหล็กเวที",
      created_by: "โหน่ง",
      created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 9).toISOString(),
      at_quotation: new Date(Date.now() - 86400000 * 9).toISOString()
    }
  ];

  // 4. Pre-populate sample led_inventory
  db.led_inventory = [
    {
      id: "inv-1",
      lot_number: "LOT2026-A",
      location: "คลัง A",
      cabinet: 20,
      module: 120,
      status: "ดี",
      notes: "สต๊อก UIRx 1.5 ล็อตแรกนำเข้าผ่านศุลกากรเรียบร้อย",
      received_by: "กี้",
      created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
      model: "UIRx 1.5",
      pixel: "1.5",
      spare_module: 12,
      date_entered: new Date(Date.now() - 86400000 * 10).toISOString().split('T')[0],
      source: "Import"
    },
    {
      id: "inv-2",
      lot_number: "LOT2026-B",
      location: "คลัง B",
      cabinet: 10,
      module: 60,
      status: "ดี",
      notes: "สต๊อก UIRx 2.5 สำหรับงานสัมมนาทั่วไป",
      received_by: "กี้",
      created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
      model: "UIRx 2.5",
      pixel: "2.5",
      spare_module: 6,
      date_entered: new Date(Date.now() - 86400000 * 8).toISOString().split('T')[0],
      source: "Import"
    },
    {
      id: "inv-3",
      lot_number: "LOT2026-C",
      location: "คลัง A",
      cabinet: 30,
      module: 180,
      status: "ดี",
      notes: "สต๊อก UOS 5 ล็อตพิเศษป้องกันน้ำมาตรฐานสูง IP65",
      received_by: "กี้",
      created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
      model: "UOS 5",
      pixel: "5",
      spare_module: 18,
      date_entered: new Date(Date.now() - 86400000 * 12).toISOString().split('T')[0],
      source: "Import"
    }
  ];

  // 5. Pre-populate sample led_transactions
  db.led_transactions = [
    {
      id: "txn-1",
      lot_number: "LOT2026-A",
      model: "UIRx 1.5",
      txn_type: "book",
      cabinet_qty: 12,
      module_qty: 72,
      txn_date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
      reference: "BK-PRJ-260619-002",
      customer: "Media Group",
      salesperson: "ต้น",
      notes: "จองสำหรับโปรเจค Billboard พระราม 9 ชั่วคราว",
      created_by: "กี้",
      created_at: new Date(Date.now() - 86400000 * 2).toISOString()
    }
  ];

  // 6. Pre-populate sample project_reports
  db.project_reports = [
    {
      id: "rep-1",
      project_id: 3,
      doc_no: "QT-2026-0001",
      doc_type: "Quotation",
      doc_url: "https://example.com/quotation-3.pdf",
      notes: "ส่งใบเสนอราคาเบื้องต้นเรียบร้อยแล้ว รอลูกค้าเซ็นอนุมัติ",
      created_by: "โหน่ง",
      created_at: new Date(Date.now() - 86400000 * 9).toISOString()
    }
  ];

  // 7. Pre-populate sample service_requests
  db.service_requests = [
    {
      id: "job-1",
      subject: "จอภาพกระพริบที่ห้องบอร์ดรูม ชั้น 4",
      department: "ฝ่ายไอที",
      details: "บริเวณฝั่งขวาล่างของตู้แสดงผลเพี้ยนบางครั้งและกระพริบ แดงค้างบางพิกเซล",
      requested_by: "ดำ",
      status: "รอดำเนินการ",
      created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 4).toISOString()
    },
    {
      id: "job-2",
      subject: "เพิ่มการติดตั้งปลั๊กพ่วงควบคุมไฟฟ้าแร็คควบคุม",
      department: "จัดซื้อ",
      details: "เพิ่มชุดยึดไฟฟ้าในตู้ควบคุม คอนโทรลเลอร์ ให้สามารถเปิดปิดแยกเฟสได้ง่ายขึ้น",
      requested_by: "หน่อง",
      status: "เสร็จสิ้น",
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 18).toISOString()
    }
  ];

  saveDb(db);
  return db;
}

// On-demand table getter to resolve loader race conditions
function getTableData(tableName) {
  const db = getDb();
  let table = db[tableName];
  
  if (!table) {
    db[tableName] = [];
    table = db[tableName];
  }

  // Defer/lazy load configs if window objects loaded after DB init
  if (table.length === 0 || (tableName === 'staff' && table.length === 1 && table[0].username === 'admin')) {
    if (tableName === 'staff' && window.STAFF_DATA && Object.keys(window.STAFF_DATA).length > 0) {
      db.staff = Object.values(window.STAFF_DATA);
      if (!db.staff.some(s => s.username === 'admin')) {
        db.staff.push({ id: "1", username: "admin", password: "1234", email: "admin@razr.com", phone: "0800000000", emp_id: "HR-MK-4-025", name: "นาย ดำรง สูงเรือง", nick: "ดำ", role: "admin", status: "active" });
      }
      saveDb(db);
      table = db.staff;
    } else if (tableName === 'led_models' && window.DEFAULT_DATA) {
      db.led_models = [];
      ["UIR", "UOS", "CIH"].forEach(g => {
        const group = window.DEFAULT_DATA[g];
        if (group && group.items) {
          group.items.forEach(item => {
            db.led_models.push({
              id: item.id || generateUUID(),
              group_id: g,
              model_name: item.name,
              name: item.name,
              resolution_width: item.rw || 0,
              resolution_height: item.rh || 0,
              cabinet_w_width: item.w || group.w,
              cabinet_h_height: item.h || group.h,
              weight_kg: item.weight || group.weight,
              max_power_w: item.max || 0,
              avg_power_w: item.avg || 0,
              price_per_sqm: item.price || 0,
              price: item.price || 0,
              brightness_nits: item.brightness || 0,
              refresh_rate_hz: item.refresh_rate || 0,
              material: item.material || "Die-casting Aluminum",
              maintenance: item.maintenance || "Front/Rear Service",
              ip_rating: item.ingress_protection || "IP30",
              led_type: item.led_type || "SMD",
              beam_angle: item.beam_angle || "160°/140°",
              color_temp: item.color_temperature || "6500K",
              grayscale: item.processing_depth || "14-bit",
              life_hours: item.life_hours || 100000,
              frame_rate: item.video_support || "60Hz",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          });
        }
      });
      saveDb(db);
      table = db.led_models;
    } else if (tableName === 'controllers' && window.DEFAULT_DATA && window.DEFAULT_DATA.controllers) {
      db.controllers = window.DEFAULT_DATA.controllers.map(c => ({
        id: c.id || generateUUID(),
        name: c.name,
        load_pixels: c.load || 0,
        price: c.price || 0
      }));
      saveDb(db);
      table = db.controllers;
    } else if (tableName === 'accessories' && window.DEFAULT_DATA && window.DEFAULT_DATA.accessories) {
      db.accessories = window.DEFAULT_DATA.accessories.map(a => ({
        id: a.id || generateUUID(),
        name: a.name,
        price: a.price || 0
      }));
      saveDb(db);
      table = db.accessories;
    }
  }
  return table;
}

// Reusable Query Builder mimicking Supabase Client
class MockSupabaseQueryBuilder {
  constructor(tableName) {
    this.tableName = tableName;
    this.filters = [];
    this.orderByField = null;
    this.orderAscending = true;
    this.isSingle = false;
    this.selectedFields = null;
    this.limitCount = null;
    this.updatePayload = null;
    this.isDelete = false;
  }

  select(fields = '*') {
    this.selectedFields = fields;
    return this;
  }

  eq(field, value) {
    this.filters.push({ type: 'eq', field, value });
    return this;
  }

  neq(field, value) {
    this.filters.push({ type: 'neq', field, value });
    return this;
  }

  in(field, values) {
    this.filters.push({ type: 'in', field, values });
    return this;
  }

  ilike(field, pattern) {
    this.filters.push({ type: 'ilike', field, pattern });
    return this;
  }

  order(field, options = {}) {
    this.orderByField = field;
    this.orderAscending = options.ascending !== false;
    return this;
  }

  limit(count) {
    this.limitCount = count;
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  async insert(payload) {
    const db = getDb();
    const table = getTableData(this.tableName);
    const payloads = Array.isArray(payload) ? payload : [payload];
    const insertedRows = [];

    for (const p of payloads) {
      const newRow = {
        id: p.id || (typeof p.id === 'number' ? table.length + 1 : generateUUID()),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...p
      };

      // Normalization check for led_models fields
      if (this.tableName === 'led_models') {
        if (newRow.name && !newRow.model_name) newRow.model_name = newRow.name;
        if (newRow.model_name && !newRow.name) newRow.name = newRow.model_name;
      }

      table.push(newRow);
      insertedRows.push(newRow);
    }

    db[this.tableName] = table;
    saveDb(db);

    return { data: Array.isArray(payload) ? insertedRows : insertedRows[0], error: null };
  }

  update(payload) {
    this.updatePayload = payload;
    return this;
  }

  delete() {
    this.isDelete = true;
    return this;
  }

  // Thenable execution for await statements
  async then(onFulfilled, onRejected) {
    try {
      let result;
      if (this.updatePayload) {
        result = await this.executeUpdate();
      } else if (this.isDelete) {
        result = await this.executeDelete();
      } else {
        result = await this.executeSelect();
      }
      return Promise.resolve(result).then(onFulfilled, onRejected);
    } catch (err) {
      return Promise.reject(err).catch(onRejected);
    }
  }

  async executeSelect() {
    const table = getTableData(this.tableName);
    let filtered = [...table];

    // Apply filters
    for (const f of this.filters) {
      if (f.type === 'eq') {
        filtered = filtered.filter(row => {
          let val = row[f.field];
          if (val === undefined && f.field === 'name') val = row['model_name'];
          if (val === undefined && f.field === 'model_name') val = row['name'];
          return String(val) === String(f.value);
        });
      } else if (f.type === 'neq') {
        filtered = filtered.filter(row => {
          let val = row[f.field];
          if (val === undefined && f.field === 'name') val = row['model_name'];
          if (val === undefined && f.field === 'model_name') val = row['name'];
          return String(val) !== String(f.value);
        });
      } else if (f.type === 'in') {
        filtered = filtered.filter(row => {
          const val = String(row[f.field]);
          return f.values.map(String).includes(val);
        });
      } else if (f.type === 'ilike') {
        const regexStr = f.pattern.replace(/%/g, '.*');
        const regex = new RegExp(`^${regexStr}$`, 'i');
        filtered = filtered.filter(row => {
          let val = row[f.field];
          if (val === undefined && f.field === 'name') val = row['model_name'];
          if (val === undefined && f.field === 'model_name') val = row['name'];
          return regex.test(String(val || ''));
        });
      }
    }

    // Apply ordering
    if (this.orderByField) {
      const field = this.orderByField;
      filtered.sort((a, b) => {
        let valA = a[field];
        if (valA === undefined && field === 'name') valA = a['model_name'];
        let valB = b[field];
        if (valB === undefined && field === 'name') valB = b['model_name'];

        if (valA < valB) return this.orderAscending ? -1 : 1;
        if (valA > valB) return this.orderAscending ? 1 : -1;
        return 0;
      });
    }

    // Limit count
    if (this.limitCount !== null) {
      filtered = filtered.slice(0, this.limitCount);
    }

    // Map fields
    if (this.selectedFields && this.selectedFields !== '*') {
      const fields = this.selectedFields.split(',').map(s => s.trim());
      filtered = filtered.map(row => {
        const mapped = {};
        fields.forEach(f => {
          let val = row[f];
          if (val === undefined && f === 'name') val = row['model_name'];
          if (val === undefined && f === 'model_name') val = row['name'];
          mapped[f] = val;
        });
        return mapped;
      });
    }

    if (this.isSingle) {
      if (filtered.length === 0) {
        return { data: null, error: { message: "Item not found" } };
      }
      return { data: filtered[0], error: null };
    }

    return { data: filtered, error: null };
  }

  async executeUpdate() {
    const db = getDb();
    const table = getTableData(this.tableName);
    let updatedCount = 0;
    const updatedRows = [];

    const updatedTable = table.map(row => {
      let isMatch = true;
      for (const f of this.filters) {
        if (f.type === 'eq') {
          let val = row[f.field];
          if (val === undefined && f.field === 'name') val = row['model_name'];
          if (val === undefined && f.field === 'model_name') val = row['name'];
          if (String(val) !== String(f.value)) {
            isMatch = false;
            break;
          }
        }
      }

      if (isMatch) {
        updatedCount++;
        const newRow = { ...row, ...this.updatePayload, updated_at: new Date().toISOString() };
        updatedRows.push(newRow);
        return newRow;
      }
      return row;
    });

    if (updatedCount > 0) {
      db[this.tableName] = updatedTable;
      saveDb(db);
    }

    return { data: updatedRows, error: null };
  }

  async executeDelete() {
    const db = getDb();
    const table = getTableData(this.tableName);
    const initialCount = table.length;

    const remainingTable = table.filter(row => {
      let isMatch = true;
      for (const f of this.filters) {
        if (f.type === 'eq') {
          let val = row[f.field];
          if (val === undefined && f.field === 'name') val = row['model_name'];
          if (val === undefined && f.field === 'model_name') val = row['name'];
          if (String(val) !== String(f.value)) {
            isMatch = false;
          }
        } else if (f.type === 'neq') {
          let val = row[f.field];
          if (val === undefined && f.field === 'name') val = row['model_name'];
          if (val === undefined && f.field === 'model_name') val = row['name'];
          if (String(val) === String(f.value)) {
            isMatch = false;
          }
        } else if (f.type === 'in') {
          const val = String(row[f.field]);
          if (!f.values.map(String).includes(val)) {
            isMatch = false;
          }
        }
      }
      return !isMatch; // Keep rows that did NOT match filter (i.e. not deleted)
    });

    if (remainingTable.length !== initialCount) {
      db[this.tableName] = remainingTable;
      saveDb(db);
    }

    return { data: null, error: null };
  }
}

// Export mock supabase object
export const supabase = {
  from(tableName) {
    return new MockSupabaseQueryBuilder(tableName);
  },
  auth: {
    async signOut() {
      return { error: null };
    }
  },
  async rpc(funcName, args) {
    if (funcName === 'update_staff_password') {
      const { staff_id, new_password } = args;
      const db = getDb();
      let found = false;
      db.staff = db.staff.map(s => {
        if (s.id === staff_id) {
          found = true;
          return { ...s, password: new_password };
        }
        return s;
      });
      if (found) {
        saveDb(db);
        return { data: true, error: null };
      }
      return { data: null, error: { message: "Staff ID not found" } };
    }
    return { data: null, error: { message: "Method not implemented" } };
  }
};

export const StaffAPI = {
  async getAll() {
    const { data } = await supabase.from("staff").select("*");
    return data || [];
  },
  async getByUsername(username) {
    const { data } = await supabase
      .from("staff")
      .select("*")
      .ilike("username", username)
      .single();
    return data || null;
  },
  async getByEmpId(empId) {
    const { data } = await supabase
      .from("staff")
      .select("*")
      .eq("emp_id", empId)
      .single();
    return data || null;
  },
  async getByNameAndNick(name, nick) {
    // Exact/partial match logic mimicking Supabase select
    const { data } = await supabase.from("staff").select("*");
    if (!data) return null;
    const match = data.find(s => 
      s.name.toLowerCase().includes(name.toLowerCase()) && 
      s.nick.toLowerCase() === nick.toLowerCase()
    );
    return match || null;
  },
  async getByEmail(email) {
    const { data } = await supabase
      .from("staff")
      .select("*")
      .eq("email", email)
      .single();
    return data || null;
  }
};

export const MasterDataAPI = {
  async fetchFull() {
    try {
      const [models, controllers, accessories] = await Promise.all([
        supabase.from("led_models").select("*").order("id", { ascending: true }),
        supabase.from("controllers").select("*").order("id", { ascending: true }),
        supabase.from("accessories").select("*").order("id", { ascending: true }),
      ]);

      const groupedModels = {
        UIR: { w: 640, h: 480, weight: 7.8, type: "indoor", items: [] },
        UOS: { w: 960, h: 960, weight: 26.5, type: "outdoor", items: [] },
        CIH: { w: 600, h: 337.5, weight: 4.0, type: "indoor", items: [] },
      };

      (models.data || []).forEach((m) => {
        let groupId = "UIR"; 
        const nameUpper = String(m.model_name || m.name || "").toUpperCase();
        if (nameUpper.startsWith("UOS")) groupId = "UOS";
        else if (nameUpper.startsWith("CIH")) groupId = "CIH";
        else if (nameUpper.startsWith("UIR")) groupId = "UIR";

        if (groupedModels[groupId]) {
          groupedModels[groupId].items.push({
            id: m.id,
            name: m.model_name || m.name,
            updated_at: m.updated_at,
            rw: parseInt(m.resolution_width, 10) || 0,
            rh: parseInt(m.resolution_height, 10) || 0,
            w: m.cabinet_w_width || groupedModels[groupId].w,
            h: m.cabinet_h_height || groupedModels[groupId].h,
            weight: parseFloat(m.weight_kg) || groupedModels[groupId].weight,
            max: parseInt(m.max_power_w, 10) || 0,
            avg: parseInt(m.avg_power_w, 10) || 0,
            price: parseFloat(m.price_per_sqm || m.price) || 0,
            brightness: parseInt(m.brightness_nits, 10) || 0,
            refresh_rate: parseInt(m.refresh_rate_hz, 10) || 0,
            material: m.material || "Die-casting Aluminum", 
            maintenance: m.maintenance || "Front/Rear Service", 
            ingress_protection: m.ip_rating || "IP30", 
            led_type: m.led_type || "SMD", 
            beam_angle: m.beam_angle || "160°/140°", 
            color_temperature: m.color_temp || "6500K", 
            processing_depth: m.grayscale || "14-bit", 
            life_hours: parseInt(m.life_hours, 10) || 100000, 
            video_support: (m.frame_rate && !m.frame_rate.includes("IP")) ? m.frame_rate : "60Hz",
            module_size: m.module_size || "",
            cabinet_resolution: m.cabinet_resolution || "",
            modules_per_cabinet: m.modules_per_cabinet || 6,
            weight_kg: m.weight_kg || 7.8,
            contrast_ratio: m.contrast_ratio || "",
            working_temp: m.working_temp || "",
            humidity: m.humidity || "",
            status_checking: m.status_checking || ""
          });
        }
      });

      return {
        ...groupedModels,
        controllers: (controllers.data || []).map((c) => ({
          id: c.id,
          name: c.name,
          load: c.load_pixels,
          price: c.price,
          updated_at: c.updated_at
        })),
        accessories: (accessories.data || []).map((a) => ({
          id: a.id,
          name: a.name,
          price: a.price,
          updated_at: a.updated_at
        })),
      };
    } catch (err) {
      console.error("DB Fetch Error:", err);
      return null;
    }
  },

  async updateItem(table, id, data) {
    const { error } = await supabase.from(table).update(data).eq("id", id);
    return !error;
  },

  async syncToDb(subsetData, deletions = {}) {
    try {
      const toInt = (v) => { const n = parseInt(v, 10); return isNaN(n) ? 0 : n; };
      const toFloat = (v) => { const n = parseFloat(v); return isNaN(n) ? 0 : n; };

      const modelFieldMap = {
        name: "model_name", price: "price_per_sqm", rw: "resolution_width", rh: "resolution_height",
        w: "cabinet_w_width", h: "cabinet_h_height",
        max: "max_power_w", avg: "avg_power_w", weight_kg: "weight_kg", brightness: "brightness_nits",
        refresh_rate: "refresh_rate_hz", material: "material", maintenance: "maintenance",
        ingress_protection: "ip_rating", led_type: "led_type", beam_angle: "beam_angle",
        color_temperature: "color_temp", processing_depth: "grayscale", life_hours: "life_hours",
        video_support: "frame_rate", display_type: "display_type", module_size: "module_size",
        cabinet_resolution: "cabinet_resolution", modules_per_cabinet: "modules_per_cabinet",
        status_checking: "status_checking", contrast_ratio: "contrast_ratio",
        working_temp: "working_temp", humidity: "humidity"
      };

      if (subsetData.UIR || subsetData.UOS || subsetData.CIH) {
        for (const g of ["UIR", "UOS", "CIH"]) {
          if (!subsetData[g] || !subsetData[g].items) continue;
          for (const item of subsetData[g].items) {
            let row = {};
            if (!item.id) {
              row = {
                group_id: g,
                model_name: String(item.name || ""), price_per_sqm: toFloat(item.price),
                name: String(item.name || ""), price: toFloat(item.price), // Keep both
                resolution_width: toInt(item.rw), resolution_height: toInt(item.rh),
                cabinet_w_width: toInt(item.w), cabinet_h_height: toInt(item.h),
                max_power_w: toInt(item.max), avg_power_w: toInt(item.avg),
                weight_kg: toFloat(item.weight_kg), brightness_nits: toInt(item.brightness),
                refresh_rate_hz: toInt(item.refresh_rate), material: String(item.material || ""),
                maintenance: String(item.maintenance || ""), ip_rating: String(item.ingress_protection || ""),
                led_type: String(item.led_type || ""), beam_angle: String(item.beam_angle || ""),
                color_temp: String(item.color_temperature || ""), grayscale: String(item.processing_depth || ""),
                life_hours: toInt(item.life_hours), frame_rate: String(item.video_support || ""),
                display_type: String(item.display_type || ""), module_size: String(item.module_size || ""),
                cabinet_resolution: String(item.cabinet_resolution || ""), modules_per_cabinet: toInt(item.modules_per_cabinet),
                status_checking: String(item.status_checking || ""), contrast_ratio: String(item.contrast_ratio || ""),
                working_temp: String(item.working_temp || ""), humidity: String(item.humidity || "")
              };
              const { error } = await supabase.from("led_models").insert(row);
              if (error) return { success: false, error: "led_models Insert Error: " + error.message };
            } else {
              if (item._dirtyFields) {
                Object.keys(item._dirtyFields).forEach(f => {
                  const dbCol = modelFieldMap[f];
                  if (dbCol) {
                    const val = item[f];
                    row[dbCol] = (typeof val === 'number') ? val : String(val || "");
                  }
                });
              } else {
                row = { model_name: item.name, name: item.name, price_per_sqm: item.price, price: item.price }; 
              }
              const { error } = await supabase.from("led_models").update(row).eq("id", item.id);
              if (error) return { success: false, error: "led_models Update Error: " + error.message };
            }
          }
        }
      }
      
      if (deletions.led_models && deletions.led_models.length > 0) {
        await supabase.from("led_models").delete().in("id", deletions.led_models);
      }

      // === 2. Controllers ===
      if (subsetData.controllers && subsetData.controllers.length > 0) {
        for (const c of subsetData.controllers) {
          if (!c.id) {
            await supabase.from("controllers").insert({ name: String(c.name || ""), load_pixels: toInt(c.load), price: toFloat(c.price) });
          } else {
            const row = {};
            if (c._dirtyFields) {
               if (c._dirtyFields.name) row.name = c.name;
               if (c._dirtyFields.load) row.load_pixels = toInt(c.load);
               if (c._dirtyFields.price) row.price = toFloat(c.price);
            }
            await supabase.from("controllers").update(row).eq("id", c.id);
          }
        }
      }
      if (deletions.controllers && deletions.controllers.length > 0) {
        await supabase.from("controllers").delete().in("id", deletions.controllers);
      }

      // === 3. Accessories ===
      if (subsetData.accessories && subsetData.accessories.length > 0) {
        for (const a of subsetData.accessories) {
          if (!a.id) {
            await supabase.from("accessories").insert({ name: String(a.name || ""), price: toFloat(a.price) });
          } else {
            const row = {};
            if (a._dirtyFields) {
               if (a._dirtyFields.name) row.name = a.name;
               if (a._dirtyFields.price) row.price = toFloat(a.price);
            }
            await supabase.from("accessories").update(row).eq("id", a.id);
          }
        }
      }
      if (deletions.accessories && deletions.accessories.length > 0) {
        await supabase.from("accessories").delete().in("id", deletions.accessories);
      }

      return { success: true };
    } catch (err) {
      console.error("Sync Error:", err);
      return { success: false, error: "Exception: " + err.message };
    }
  },
};
