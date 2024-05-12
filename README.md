# [Math Curves](https://pauldubois98.github.io/MathCurves/)

A tool to decompose &amp; visualize mathematical curves.

## Bézier curves

Bézier curves are parametric polynomial curves; see more on the [wikipedia page](https://en.wikipedia.org/wiki/B%C3%A9zier_curve).

This [online tool](https://pauldubois98.github.io/MathCurves/BezierCurves) enable you to visualize Bézier curves and how they are created.

You can create funny shapes of your own, such as:

- [a heart](https://pauldubois98.github.io/MathCurves/BezierCurves/index.html?n=10&t=1&animation=on&xs=[286,56,198,310,88,485,262,416,527,288]&ys=[374,214,68,101,378,380,98,71,199,374])
- [a spiral](https://pauldubois98.github.io/MathCurves/BezierCurves/index.html?n=13&t=0.3780000000000002&animation=on&xs=[314,312,245,222,364,440,385,207,100,221,417,518,484]&ys=[197,237,243,140,95,183,332,356,206,39,42,187,386])
- [a diamond](https://pauldubois98.github.io/MathCurves/BezierCurves/index.html?n=10&t=0.2050000000000001&animation=on&xs=[331,86,329,80,524,84,526,332,534,338]&ys=[61,334,58,334,334,339,339,61,338,60]).

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

## Polynomial Fits
- [Online tool](https://pauldubois98.github.io/MathCurves/PolynomialCurves/)
- [Typical cubic fit](https://pauldubois98.github.io/MathCurves/PolynomialCurves/?xs=-0.75%2C0.75%2C-0.35%2C0.35&ys=-0.75%2C0.75%2C0.5%2C-0.5&degree=3&lr=0.1&optim=adam)
- [Typical quadratic fit](https://pauldubois98.github.io/MathCurves/PolynomialCurves/?xs=-0.833%2C-0.817%2C-0.803%2C-0.783%2C-0.767%2C-0.75%2C-0.73%2C-0.713%2C-0.697%2C-0.67%2C-0.653%2C-0.627%2C-0.603%2C-0.587%2C-0.56%2C-0.533%2C-0.513%2C-0.49%2C-0.453%2C-0.433%2C-0.403%2C-0.373%2C-0.343%2C-0.3%2C-0.263%2C-0.217%2C-0.17%2C-0.12%2C-0.067%2C-0.017%2C0.033%2C0.077%2C0.123%2C0.163%2C0.2%2C0.237%2C0.273%2C0.3%2C0.327%2C0.353%2C0.38%2C0.407%2C0.43%2C0.453%2C0.477%2C0.497%2C0.517%2C0.537%2C0.557%2C0.577%2C0.593%2C0.61%2C0.633%2C0.65%2C0.663%2C0.677%2C0.693%2C0.717%2C0.727&ys=0.677%2C0.623%2C0.573%2C0.527%2C0.477%2C0.427%2C0.38%2C0.33%2C0.273%2C0.23%2C0.18%2C0.133%2C0.083%2C0.03%2C-0.013%2C-0.057%2C-0.107%2C-0.153%2C-0.19%2C-0.237%2C-0.277%2C-0.317%2C-0.36%2C-0.39%2C-0.43%2C-0.463%2C-0.483%2C-0.503%2C-0.517%2C-0.51%2C-0.493%2C-0.467%2C-0.447%2C-0.413%2C-0.37%2C-0.33%2C-0.29%2C-0.247%2C-0.203%2C-0.16%2C-0.117%2C-0.073%2C-0.027%2C0.02%2C0.07%2C0.117%2C0.163%2C0.21%2C0.257%2C0.303%2C0.353%2C0.403%2C0.453%2C0.503%2C0.553%2C0.603%2C0.653%2C0.7%2C0.75&degree=2&lr=0.5&optim=sgd)
