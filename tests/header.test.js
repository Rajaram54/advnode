const Page = require("./helpers/page");

let page;

beforeEach(async () => {
    page = await Page.build();
    await page.goto('localhost:3000');
});

afterEach(async() => {
    await page.close();
});

test("We are launching newPage", async () => {
    const text = await page.getContentOf('a.brand-logo');
    expect(text).toEqual("Blogster");
});

test("Clicking login with google", async () => {
    await page.click('.right a');
    const url = await page.url();
    expect(url).toMatch(/accounts\.google\.com/);
});

test("faking session", async () => {
    await page.login();
    const text = await page.getContentOf('a[href="/auth/logout"]');
    expect(text).toEqual('Logout');
});