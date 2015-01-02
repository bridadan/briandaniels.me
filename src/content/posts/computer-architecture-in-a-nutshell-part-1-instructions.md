---
title: "Computer Architecture In A Nutshell Part 1: Instructions"
date: 2014-12-25
---

I thought a brief overview of computer architecture would help people who are interested in emulators, embedded systems, or just computers in general.

###A Lil' History
Back in the old days, a few nerds made the first computers. They only worked with a keyboard and a screen. The screen couldn't even draw graphics, it could just print out characters. But they were still immensely useful for doing math and other repetitive tasks quickly (faster than a person at least).

Computers have a heck of a lot more capability today than they did back then, but they still have at least two things in common: they move numbers and they compute on numbers.

###I Speak Numbers
How do we tell computers what to do? Yelling at them (unfortunately) doesn't work. If not English, Spanish, French, or whatever, what "language" *do* they speak?

Computers speak numbers. That sounds really dumb, but it's the truth. Spoken and written language are pretty ambiguous, but numbers are exact. That comes in handy when you are trying to tell the computer to do a precise task that can be repeated millions and billions of times.

So say I want to tell a computer to add 1 and 2 together. You and I both know that 1 + 2 = 3. The computer doesn't know that adding 1 + 2 = 3, but it does know how to add any two numbers. We just have to tell it to do that. Like we said earlier, computers speak numbers. So we have to come up with some sort of code to tell the computer what to do.

Let's say the number 1 means "Add 1 and 2 and print the answer on the screen". So we type in a "1", and the computer comes back and prints "3". Woo!

Now I want to add 5 + 3. Using the previous example, we could say the number 2 means "Add 5 and 3 and print the answer on the screen". And this will work, but what if want to add any two arbitrary numbers? We would have to come up with a huge amount of code numbers to represent every combination of two numbers.

Instead what we want to do is say "Add `x` and `y` and print the answer on the screen" where `x` and `y` can be any number. This seems better, now we just have to have one code number to the computer to do an "add".

Now let's say that the "add" code number is 1. We now type "1 `x` `y`" into the computer, replacing `x` and `y` with the two numbers I want to add. For example, "1 1 2" will add 1 + 2, "1 5 3" will add 5 + 3, etc. This is great! Now we just have the one code number to add any two numbers. Simple!

###Save It For Later
That's all fine and dandy. But if I want to save the number to use later and
