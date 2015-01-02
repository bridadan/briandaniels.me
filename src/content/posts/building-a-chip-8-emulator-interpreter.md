---
title: "Building a Chip-8 Emulator\\Interpreter"
date: 2014-12-29
---

Chip-8 is a simple interpreted language that can be used to write games. It was originally designed to run on older machines with limited memory. The whole interpreter usually only took up 512 bytes, and the games were even smaller! It only has 36 instructions and a few registers, so the whole system is very straightforward and easy to interpret. I decided to write the whole thing in C because I wanted it to be portable to other platforms. I used CUnit for testing and SDL for the graphics, sound, and keyboard input.

##Nitty Gritty
I used the extremely well written ["Cowgod's Chip-8 Technical Reference"](http://devernay.free.fr/hacks/chip8/C8TECH10.HTM) extensively throughout writing my interpreter. If you're considering writing one yourself, I highly encourage you to read through it and bookmark it. It's not very long but it is very understandable and complete.

I won't go through every bit of code, but I'll try to hit the interesting buts. Feel free to browse all of the code on [GitHub](http://github.com). Also, if you feel lost with some of the terminology, check out my post [Computer Architecture In A Nutshell](/posts/computer-architecture-in-a-nutshell-part-1-instructions).

###Decoding Instructions
Each Chip-8 game comes in the form of a ROM, just like any other emulator. A ROM is just a hex/binary file that contains a whole bunch of numbers. Each Chip-8 instruction is 2 bytes (16 bits), so we load all of these into an array and just start iterating through the t

###Tests
I've never really written a project that had extensive unit tests, but I decided to go for it this time. **BEST CHOICE EVER**. There were some random little bugs in performing some of the instructions that would have taken forever to chase down without the tests. I highly recommend taking the time to write tests for your project. Even though they take time to write, they can save you hours of debugging time later.

```C
if (working) {
  dontFreakOut();
}
```
