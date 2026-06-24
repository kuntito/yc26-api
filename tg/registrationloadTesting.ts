const API_URL = "https://yc26-api-production.up.railway.app/api/yc26/register";

const generateEmail = (index: number) => `loadtest+${index}@yc26test.com`;

const registerCamper = async (index: number) => {
    const start = Date.now();
    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                firstName: "Load",
                lastName: "Test",
                email: generateEmail(index),
                genderId: 1,
                branchId: 1,
                fellowshipId: 1,
                unitId: 1,
            }),
        });
        const duration = Date.now() - start;
        const data = await res.json();
        return {
            index: index,
            status: res.status,
            duration: duration,
            success: data.success,
        };
    } catch (e) {
        return {
            index: index,
            status: 0,
            duration: Date.now() - start,
            success: false,
        };
    }
};

const runLoadTest = async (concurrentUsers: number) => {
    console.log(`firing ${concurrentUsers} concurrent requests...`);

    const requests = Array.from(
        { length: concurrentUsers },
        (_, i) => registerCamper(i)
    );

    const results = await Promise.all(requests);

    const succeeded = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    const durations = results.map(r => r.duration);
    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    const maxDuration = Math.max(...durations);
    const minDuration = Math.min(...durations);

    console.log(`\nresults:`);
    console.log(`  succeeded: ${succeeded}`);
    console.log(`  failed:    ${failed}`);
    console.log(`  avg:       ${avgDuration.toFixed(0)}ms`);
    console.log(`  min:       ${minDuration}ms`);
    console.log(`  max:       ${maxDuration}ms`);

    console.log(`\nper request:`);
    results.forEach(r => {
        console.log(`  [${r.index}] status=${r.status} duration=${r.duration}ms success=${r.success}`);
    });
};

runLoadTest(300);