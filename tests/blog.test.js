const Page = require("./helpers/page");

let page;

beforeEach(async () => {
    page = await Page.build();
    await page.goto('localhost:3000');
});

afterEach(async() => {
    await page.close();
});

describe('When login', async () => {
    beforeEach(async () => {
        await page.login();
        await page.click('a.btn-floating');
    });

    test('when login checking create form blog', async () => {
        const text = await page.getContentOf('form label');
        expect(text).toEqual('Blog Title');
    });

    describe('valid input', async () => {
        beforeAll(async () => {
            await page.type('.title input', 'My title');
            await page.type('.content input', 'My content');
            await page.click('form button');
        });
    
        test('submitting review', async () => {
            const text = await page.getContentOf('h5');
            expect(text).toEqual('Please confirm you entries');
        });

        test('clicking button for save', async () => {
            await page.click('button.green');
            await page.waitFor('.card');
            
        });
       })


   describe('invalid input', async () => {
    beforeAll(async () => {
        await page.click('form button');
    });

    test('validate invalid text alert while submitting form', async () => {
        const titleError = await page.getContentOf('.title .red-text');
        const contentError = await page.getContentOf('.content .red-text');
        expect(titleError).toEqual('You must provide a value');
        expect(contentError).toEqual('You must provide a value');
    });
   })
})
