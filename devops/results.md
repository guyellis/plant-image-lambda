## Example file size change in MB

```
orig  4.7
xl    1.4
lg    0.89
md    0.439
sm    0.156
thumb 0.058
```

## Apples to Apples cost/time comparison

```
File size: 6.9 MB
2992 x 4000
From this created 5 smaller images with widths of:
2000, 1500, 1000, 500, 100
```

### Using async.eachOfSeries

Duration: 15200 ms Memory Size: 1024 MB Max Memory Used: 268 MB

### Using async.eachOf

Duration: 14300 ms Memory Size: 1024 MB Max Memory Used: 624 MB

### Cost comparison

AWS Lambda Costs on 9/11/2016

```
         Mem       Mem                   Spare               Cost
Time    Used    Needed      Cost Used	    Mem     Per 1m    Ratio
15.2     268       320    0.000079192       52     $79.19
14.3     624       640    0.000149006       16	   $149.01    1.88
```

### Conclusion

Using JavaScript's async processing buys us very little, as expected, because this is a mostly compute intensive activity.
A tiny gain of 0.9 seconds is made when running all the image sizing in parallel which I assume is from the small amount of wait time saved on the IO.
The total time is very close because we have a single thread running on a single core doing the same work.
Optimizing for cost we would do the processing in series.
Optimizing for (a very small time gain) we would do the processing as an async-parallel.

