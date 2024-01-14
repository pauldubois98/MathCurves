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
$f: [0,1] \to \mathbb{C}$, $f \in \mathcal{C}^{\infty}$, $$f(t) = \sum_{k=-N}^{N} r_k e^{2 \pi i k t + a_k} \ , \quad f(0)=f(1)$$
They can approximate any continuous closed path in $\mathbb{R}$ with arbitrary precision (given $N$ is large enough).