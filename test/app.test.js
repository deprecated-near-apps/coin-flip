const nearAPI = require('near-api-js');
const testUtils = require('./test-utils');
const getConfig = require('../src/config');
const { formatNearAmount } = require('near-api-js/lib/utils/format');

const { KeyPair, Account, utils: { format: { parseNearAmount }} } = nearAPI;
const { 
	connection, initContract, getAccount, getContract,
	contract,
	contractAccount, contractName, contractMethods, createAccessKeyAccount
} = testUtils;
const { GAS } = getConfig();

jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

describe('deploy contract ' + contractName, () => {
	let alice, contract;

	beforeAll(async () => {
		alice = await getAccount();
		await initContract(alice.accountId);
	});

	test('contract hash', async () => {
		let state = (await new Account(connection, contractName)).state();
		expect(state.code_hash).not.toEqual('11111111111111111111111111111111');
	});

	test('check deposit', async () => {
        contract = await getContract(alice)
		await contract.deposit({}, GAS, parseNearAmount('19'));
        const credits = await contract.get_credits({ account_id: alice.accountId })
        expect(credits).toEqual(parseNearAmount('19'))
	});

	test('check play', async () => {
        
        for (let i = 0; i < 5; i++) {
            const rand = await contract.play({}, GAS);
            console.log(rand)
            const credits = await contract.get_credits({ account_id: alice.accountId })
            console.log(credits)
        }

        expect(true)
	});


});