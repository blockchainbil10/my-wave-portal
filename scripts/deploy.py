from brownie import WavePortal, accounts, config
from scripts.helpful_scripts import get_account

def main():

    dev = get_account()

    wave_portal = WavePortal.deploy({'value': '0.1 ether', 'from': dev})
    print("Contract deployed to: ", wave_portal.address)
    print("Contract deployed by:", wave_portal.owner())

    contractBalance = wave_portal.balance()
    print("Contract Balance: ", contractBalance)

    wave_count = wave_portal.getTotalWaves()
    print(wave_count)
    wave_tx = wave_portal.wave('This is wave #1', {'from': dev})
    wave_tx.wait(1)
    contractBalance = wave_portal.balance()
    print("Contract Balance: ", contractBalance)
    wave_tx = wave_portal.wave('This is wave #2', {'from': dev})
    wave_tx.wait(1)  
    contractBalance = wave_portal.balance()
    print("Contract Balance: ", contractBalance)
    wave_count = wave_portal.getTotalWaves()
    print(wave_count)