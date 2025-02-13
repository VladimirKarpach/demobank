import {test as base} from '@playwright/test'
import { LoginPage } from './pages/loginPage';
import { Navigation } from './pages/bankPage';
import { MojPuplitPage } from './pages/mojPolpitPage';

export type Fixtures = {
    openSite: string
    signIn: string
    onLoginPage: LoginPage
    onMojPulpitPage: MojPuplitPage
    navigateTo: Navigation
}

export const test = base.extend<Fixtures>({
    onLoginPage: async({page}, use) => {
        const onLoginPage = new LoginPage(page);
        await use(onLoginPage);
    },

    onMojPulpitPage: async({page}, use) => {
        const onMojPulpitPage = new MojPuplitPage(page);
        await use(onMojPulpitPage);
    },

    navigateTo: async({page}, use) => {
        const navigateTo = new Navigation(page);
        await use(navigateTo);
    },

    openSite: async({page}, use) => {
        await page.goto('https://demo-bank.vercel.app/');
        await use('');
    },

    signIn: async({page, openSite}, use) => {
        await page.locator('#login_id').fill('TestUser');
        await page.locator('#login_password').fill('TestPass');
        await page.getByRole('button').click();
        await use('');
    }
})