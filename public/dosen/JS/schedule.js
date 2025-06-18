class ScheduleManager {
    constructor() {
        this.selectedYear = new Date().getFullYear();
        this.selectedMonth = null;
        this.selectedDate = null;
        this.schedules = {};
        this.init();
    }

    init() {
        this.setupListeners();
        this.updateMonthButtons();
        this.setupCSRF();
    }

    setupCSRF() {
        const token = document.querySelector('meta[name="csrf-token"]');
        if (token) {
            this.csrfToken = token.getAttribute('content');
        }
    }

    setupListeners() {
        document.getElementById('year-select').onchange = e => {
            this.selectedYear = +e.target.value;
            this.updateMonthButtons();
        };
        document.querySelectorAll('.month-btn').forEach(btn =>
            btn.onclick = () => this.selectMonth(+btn.dataset.month)
        );
        document.getElementById('back-btn').onclick = () => this.showMonthSelection();
        document.getElementById('close-modal').onclick = () => this.closeModal();
        document.getElementById('cancel-btn').onclick = () => this.closeModal();
        document.getElementById('save-btn').onclick = () => this.saveSchedule();
        document.getElementById('schedule-modal').onclick = e => {
            if (e.target.id==='schedule-modal') this.closeModal();
        };
        document.getElementById('prev-month').onclick = () => this.changeMonth(-1);
        document.getElementById('next-month').onclick = () => this.changeMonth(1);
    }

    updateMonthButtons() {
        const now = new Date();
        document.querySelectorAll('.month-btn').forEach(btn => {
            const m = +btn.dataset.month;
            const active = (this.selectedYear>now.getFullYear()) ||
                (this.selectedYear===now.getFullYear() && m>=now.getMonth());
            btn.disabled = !active;
            btn.classList.toggle('disabled', !active);
        });
    }

    selectMonth(month) {
        this.selectedMonth = month;
        this.showCalendar();
    }

    showMonthSelection() {
        document.getElementById('month-selection').classList.add('active');
        document.getElementById('calendar-view').classList.remove('active');
    }

    showCalendar() {
        document.getElementById('month-selection').classList.remove('active');
        document.getElementById('calendar-view').classList.add('active');
        this.renderTitle();
        this.generateCalendar();
        this.loadSchedules();
    }

    renderTitle() {
        const names = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
        document.getElementById('calendar-title').textContent =
            `${names[this.selectedMonth]} ${this.selectedYear}`;
    }

    generateCalendar() {
        const grid = document.getElementById('calendar-grid');
        grid.innerHTML = '';
        const firstDay = new Date(this.selectedYear, this.selectedMonth,1).getDay();
        const days = new Date(this.selectedYear,this.selectedMonth+1,0).getDate();

        for (let i=0;i<firstDay;i++){
            const e = document.createElement('div');
            e.classList.add('day-cell','empty');
            grid.appendChild(e);
        }
        for(let d=1;d<=days;d++){
            const cell = document.createElement('div');
            cell.classList.add('day-cell');
            cell.textContent = d;
            const key=`${this.selectedYear}-${String(this.selectedMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
            if(this.schedules[key]) cell.classList.add('has-schedule');
            const today=new Date();
            if(this.selectedYear===today.getFullYear()&&this.selectedMonth===today.getMonth()&&d===today.getDate())
                cell.classList.add('today');
            cell.onclick=()=>this.openModal(d);
            grid.appendChild(cell);
        }
    }

    loadSchedules() {
        fetch(`/get-calendar?year=${this.selectedYear}&month=${this.selectedMonth+1}`)
            .then(r=>r.json())
            .then(j=>{ this.schedules=j.schedules||{}; this.generateCalendar(); })
            .catch(console.error);
    }

    openModal(day) {
        this.selectedDate = day;
        fetch(`/edit-schedule?year=${this.selectedYear}&month=${this.selectedMonth+1}&date=${day}`)
            .then(r=>r.json())
            .then(data=>{
                document.getElementById('modal-title').textContent=`Edit Jadwal - ${data.date}`;
                for(let i=1;i<=4;i++){
                    document.getElementById(`shift${i}`).value=data.schedules[`shift${i}`]||'';
                }
                document.getElementById('schedule-modal').classList.add('open');
            })
            .catch(console.error);
    }

    closeModal() {
        document.getElementById('schedule-modal').classList.remove('open');
    }

    saveSchedule() {
        const shifts={};
        for(let i=1;i<=4;i++){
            shifts[`shift${i}`]=document.getElementById(`shift${i}`).value;
        }
        fetch('/save-schedule',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'X-CSRF-TOKEN':this.csrfToken
            },
            body:JSON.stringify({
                year:this.selectedYear,
                month:this.selectedMonth+1,
                date:this.selectedDate,
                shifts
            })
        })
        .then(r=>r.json())
        .then(res=>{
            if(res.success){
                const key=`${this.selectedYear}-${String(this.selectedMonth+1).padStart(2,'0')}-${String(this.selectedDate).padStart(2,'0')}`;
                this.schedules[key]=shifts;
                this.generateCalendar();
                this.closeModal();
            } else alert('Gagal simpan');
        })
        .catch(console.error);
    }

    changeMonth(offset) {
        let y=this.selectedYear, m=this.selectedMonth+offset;
        if(m<0){ y--; m=11; }
        if(m>11){ y++; m=0; }
        this.selectedYear=y; this.selectedMonth=m;
        this.updateMonthButtons();
        this.showCalendar();
    }
}

document.addEventListener('DOMContentLoaded', ()=> new ScheduleManager());
