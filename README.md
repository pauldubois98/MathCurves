# [Math Curves](https://pauldubois98.github.io/MathCurves/)

A tool to decompose &amp; visualize mathematical curves.

## Bézier curves

Bézier curves are parametric polynomial curves; see more on the [wikipedia page](https://en.wikipedia.org/wiki/B%C3%A9zier_curve).

This [online tool](https://pauldubois98.github.io/MathCurves/BezierCurves) enable you to visualize Bézier curves (you are free to move the control points etc...) and how they are created.
You can create funny shapes of your own, such as this [heart example](https://pauldubois98.github.io/MathCurves/BezierCurves/index.html?n=10&t=1&animation=on&xs=[286,56,198,310,88,485,262,416,527,288]&ys=[374,214,68,101,378,380,98,71,199,374]),
[spiral](https://pauldubois98.github.io/MathCurves/BezierCurves/index.html?n=13&t=0.3780000000000002&animation=on&xs=[314,312,245,222,364,440,385,207,100,221,417,518,484]&ys=[197,237,243,140,95,183,332,356,206,39,42,187,386]) or
[diamond](https://pauldubois98.github.io/MathCurves/BezierCurves/index.html?n=10&t=0.2050000000000001&animation=on&xs=[331,86,329,80,524,84,526,332,534,338]&ys=[61,334,58,334,334,339,339,61,338,60]).

## Fourier curves

We call Fourier curves functions of the form:
$f: [0,1] \to \mathbb{C}$, $f \in \mathcal{C}^{\infty}$, $$f(t) = \sum_{k=-N}^{M} r_k e^{2 \pi i k t + a_k} \ , \quad f(0)=f(1)$$
They can approximate any continuous closed path in $\mathbb{R}$ with arbitrary precision (given $N$ and $M$ is large enough).

You can try to:

- [set coefficients yourself](https://pauldubois98.github.io/MathCurves/FourierCurves)
- [interpolate points](https://pauldubois98.github.io/MathCurves/FourierCurves/interpolation)
- [draw a close loop path](https://pauldubois98.github.io/MathCurves/FourierCurves/drawing)

Glass example:

- [setting coefficients](https://pauldubois98.github.io/MathCurves/FourierCurves/index.html?COEFFS=[{k:0,r:420,a:45},{k:-7,r:12,a:137},{k:-6,r:9,a:-24},{k:-5,r:5,a:175},{k:-4,r:5,a:14},{k:-3,r:28,a:-147},{k:-2,r:23,a:-128},{k:-1,r:163,a:-109},{k:1,r:60,a:-71},{k:2,r:32,a:128},{k:3,r:31,a:147},{k:4,r:21,a:-14},{k:5,r:10,a:-175},{k:6,r:4,a:24},{k:7,r:9,a:-137},]&min=7&max=7)
- [interpolating points](https://pauldubois98.github.io/MathCurves/FourierCurves/interpolation.html?min=7&max=7&POINTS=[{x:210,y:100},{x:267.5,y:100},{x:325,y:100},{x:382.5,y:100},{x:440,y:100},{x:455,y:125},{x:470,y:150},{x:485,y:175},{x:500,y:200},{x:462.5,y:225},{x:425,y:250},{x:387.5,y:275},{x:350,y:300},{x:350,y:350},{x:350,y:400},{x:350,y:450},{x:350,y:500},{x:375,y:507.5},{x:400,y:515},{x:425,y:522.5},{x:450,y:530},{x:325,y:530},{x:200,y:530},{x:225,y:522.5},{x:250,y:515},{x:275,y:507.5},{x:300,y:500},{x:300,y:450},{x:300,y:400},{x:300,y:350},{x:300,y:300},{x:262.5,y:275},{x:225,y:250},{x:187.5,y:225},{x:150,y:200},{x:165,y:175},{x:180,y:150},{x:195,y:125},])
