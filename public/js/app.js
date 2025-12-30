const { createApp } = Vue;

createApp({
    data() { 
        return { 
            casinos: [], 
            slotsData: {}, 
            payments: [], 
            weeklySchedule: [], 
            skillArticles: [],
            mathSlides: [], // <--- New Data
            activeMathSlide: 0, // <--- New State
            currentDayIndex: 0, 
            filter: 'all', 
            loading: true, 
            error: false, 
            visibleCount: 9 
        }
    },
    async mounted() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const apiUrl = urlParams.get('dev') ? `/api/data?dev=true` : `/api/data`;
            
            const res = await fetch(apiUrl);
            
            if (res.status === 403) { 
                this.error = true; 
            } else { 
                const data = await res.json(); 
                this.casinos = data.casinos || [];
                this.slotsData = data.slots || {}; 
                this.payments = data.payments || [];
                this.weeklySchedule = data.weekly || []; 
                this.skillArticles = data.articles || [];
                this.mathSlides = data.math || []; // <--- Load Data
            }
        } catch (e) { 
            console.error("Fetch Error:", e); 
        } finally { 
            this.loading = false; 
        }
    },
    computed: { 
        filteredCasinos() { 
            if (!this.casinos) return [];
            return this.filter === 'all' ? this.casinos : this.casinos.filter(c => c.bonus_type === this.filter); 
        },
        visibleCasinos() { 
            return this.filteredCasinos.slice(0, this.visibleCount); 
        },
        referralCasinos() { 
            if (!this.casinos) return [];
            return this.casinos.filter(c => c.referral_bonus); 
        },
        currentDayData() {
            if (!this.weeklySchedule || this.weeklySchedule.length === 0) {
                return { day: 'Loading...', rewards: [] };
            }
            return this.weeklySchedule[this.currentDayIndex] || { day: 'Error', rewards: [] };
        },
        currentDayLabel() {
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const today = new Date();
            const targetDate = new Date(today);
            targetDate.setDate(today.getDate() + this.currentDayIndex);
            return days[targetDate.getDay()];
        },
        todayName() { 
            return new Date().toLocaleDateString('en-US', { weekday: 'long' }); 
        }
    },
    methods: {
        nextDay() {
            if (!this.weeklySchedule.length) return;
            if (this.currentDayIndex < this.weeklySchedule.length - 1) {
                this.currentDayIndex++;
            } else {
                this.currentDayIndex = 0; 
            }
        },
        prevDay() {
            if (!this.weeklySchedule.length) return;
            if (this.currentDayIndex > 0) {
                this.currentDayIndex--;
            } else {
                this.currentDayIndex = this.weeklySchedule.length - 1; 
            }
        },
        // --- NEW MATH SLIDER METHODS ---
        nextMath() {
            if (this.activeMathSlide < this.mathSlides.length - 1) {
                this.activeMathSlide++;
            } else {
                this.activeMathSlide = 0;
            }
        },
        prevMath() {
            if (this.activeMathSlide > 0) {
                this.activeMathSlide--;
            } else {
                this.activeMathSlide = this.mathSlides.length - 1;
            }
        },
        handleImageError(e) { 
            e.target.style.display='none'; 
        }
    }
}).mount('#app');

