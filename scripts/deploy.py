import wave
from brownie import WavePortal, accounts

def main():

    wave_portal = WavePortal.deploy({'from': accounts[0]})
    print("Contract deployed to: ", wave_portal.address)
    print("Contract deployed by:", wave_portal.owner())

    wave_count = wave_portal.getTotalWaves()
    print(wave_count)
    wave_tx = wave_portal.wave({'from': accounts[1]})
    wave_tx.wait(1)  
    wave_count = wave_portal.getTotalWaves()
    print(wave_count)