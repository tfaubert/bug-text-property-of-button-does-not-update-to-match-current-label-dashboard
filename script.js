class TestPlanDashboard {
    constructor() {
        this.tests = JSON.parse(localStorage.getItem('tests')) || [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
        this.updateStats();
    }

    bindEvents() {
        const addButton = document.getElementById('add-test');
        const testInput = document.getElementById('test-input');

        addButton.addEventListener('click', () => this.addTest());
        testInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTest();
        });
    }

    addTest() {
        const input = document.getElementById('test-input');
        const testName = input.value.trim();

        if (!testName) return;

        const test = {
            id: Date.now(),
            name: testName,
            status: 'pending'
        };

        this.tests.push(test);
        this.saveTests();
        this.render();
        this.updateStats();
        input.value = '';
    }

    toggleTestStatus(id) {
        const test = this.tests.find(t => t.id === id);
        if (!test) return;

        const statusOrder = ['pending', 'passed', 'failed'];
        const currentIndex = statusOrder.indexOf(test.status);
        test.status = statusOrder[(currentIndex + 1) % statusOrder.length];

        this.saveTests();
        this.render();
        this.updateStats();
    }

    deleteTest(id) {
        this.tests = this.tests.filter(t => t.id !== id);
        this.saveTests();
        this.render();
        this.updateStats();
    }

    render() {
        const testList = document.getElementById('test-list');
        testList.innerHTML = '';

        this.tests.forEach(test => {
            const li = document.createElement('li');
            li.className = `test-item ${test.status}`;
            li.innerHTML = `
                <div class="test-status ${test.status}" onclick="dashboard.toggleTestStatus(${test.id})"></div>
                <span class="test-name">${test.name}</span>
                <button class="delete-test" onclick="dashboard.deleteTest(${test.id})">×</button>
            `;
            testList.appendChild(li);
        });
    }

    updateStats() {
        const passed = this.tests.filter(t => t.status === 'passed').length;
        const failed = this.tests.filter(t => t.status === 'failed').length;
        const pending = this.tests.filter(t => t.status === 'pending').length;
        const total = this.tests.length;

        document.getElementById('passed-count').textContent = passed;
        document.getElementById('failed-count').textContent = failed;
        document.getElementById('pending-count').textContent = pending;

        const progress = total > 0 ? Math.round(((passed + failed) / total) * 100) : 0;
        document.getElementById('progress-fill').style.width = `${progress}%`;
        document.getElementById('progress-text').textContent = `${progress}% Complete`;
    }

    saveTests() {
        localStorage.setItem('tests', JSON.stringify(this.tests));
    }
}

// Initialize dashboard when page loads
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new TestPlanDashboard();
});