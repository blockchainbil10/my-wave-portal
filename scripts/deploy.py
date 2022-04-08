import wave
from brownie import WavePortal, accounts, config

def main():

    dev = accounts.add(config["wallets"]["from_key"])

    wave_portal = WavePortal.deploy({'from': accounts[0]})
    print("Contract deployed to: ", wave_portal.address)
    print("Contract deployed by:", wave_portal.owner())

    wave_count = wave_portal.getTotalWaves()
    print(wave_count)
    wave_tx = wave_portal.wave({'from': dev})
    wave_tx.wait(1)  
    wave_count = wave_portal.getTotalWaves()
    print(wave_count)