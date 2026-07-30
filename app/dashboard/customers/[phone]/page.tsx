import { getSales } from "@/lib/google/sales";
import { getPaymentsByCustomerPhone } from "@/lib/google/payments";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  formatCurrency,
  formatDate,
} from "@/lib/utils/format";

import {
  SendReminderButton
} from "@/components/dashboard/send-reminder-button";


interface Props {
  params: Promise<{
    phone: string;
  }>;
}


export default async function CustomerPage({
  params,
}: Props) {

  const { phone } = await params;


  const sales = await getSales();


  const customerSales = sales.filter(
    (sale) => sale.phone === phone
  );


  const customerPayments = (
    await getPaymentsByCustomerPhone(phone)
  ).sort(
    (a,b)=>
      new Date(b.date).getTime() -
      new Date(a.date).getTime()
  );


  const customer = customerSales[0];


  if(!customer){
    return (
      <div className="p-8 text-center text-muted-foreground">
        फ्रँचायझी माहिती उपलब्ध नाही.
      </div>
    );
  }



  const totalPurchases =
    customerSales.reduce(
      (sum,sale)=>sum + sale.total,
      0
    );


  const totalPaid =
    customerSales.reduce(
      (sum,sale)=>sum + sale.amountPaid,
      0
    );


  const outstanding =
    customerSales.reduce(
      (sum,sale)=>sum + sale.amountRemaining,
      0
    );



  return (

    <main className="space-y-8">


      {/* Header */}

      <div className="
        rounded-xl
        border
        p-6
        flex
        justify-between
        items-center
      ">


        <div>

          <h1 className="
            text-3xl
            font-bold
          ">
            {customer.customer}
          </h1>


          <p className="
            text-muted-foreground
            mt-1
          ">
            📞 {customer.phone}
          </p>


          <p className="
            text-sm
            text-muted-foreground
            mt-2
          ">
            फ्रँचायझी खाते
          </p>

        </div>



        {
          outstanding > 0 && (

            <SendReminderButton
              customer={customer.customer}
              phone={customer.phone}
              amount={outstanding}
            />

          )
        }


      </div>





      {/* Summary */}


      <div className="
        grid
        gap-4
        md:grid-cols-3
      ">


        <div className="rounded-xl border p-5">

          <p className="text-sm text-muted-foreground">
            एकूण खरेदी
          </p>

          <p className="text-2xl font-bold mt-2">
            {formatCurrency(totalPurchases)}
          </p>

        </div>



        <div className="rounded-xl border p-5">

          <p className="text-sm text-muted-foreground">
            जमा रक्कम
          </p>

          <p className="
            text-2xl
            font-bold
            text-green-600
            mt-2
          ">
            {formatCurrency(totalPaid)}
          </p>

        </div>




        <div className="rounded-xl border p-5">

          <p className="text-sm text-muted-foreground">
            बाकी रक्कम
          </p>


          <p className="
            text-2xl
            font-bold
            text-red-600
            mt-2
          ">
            {formatCurrency(outstanding)}
          </p>


        </div>


      </div>





      {/* Sales History */}

      <section className="
        rounded-xl
        border
      ">


        <div className="
          border-b
          p-5
        ">

          <h2 className="text-xl font-bold">
            ऑर्डर इतिहास
          </h2>

        </div>



        <div>


        {
          customerSales.map((sale)=>(


            <div
              key={sale.id}
              className="
                p-5
                border-b
                last:border-b-0
                space-y-4
              "
            >


              <div className="
                flex
                justify-between
              ">

                <div>

                  <p className="font-semibold">
                    {formatDate(sale.date)}
                  </p>


                  <p className="
                    text-sm
                    text-muted-foreground
                  ">
                    📦 {sale.quantity} पाऊच
                  </p>

                </div>


                <p className="font-bold">
                  {formatCurrency(sale.total)}
                </p>

              </div>





              <div className="
                rounded-lg
                bg-muted/40
                p-4
                flex
                justify-between
                items-center
              ">


                <div className="space-y-1">

                  <p className="text-sm">
                    भरले:
                    <span className="font-semibold ml-1">
                      {formatCurrency(sale.amountPaid)}
                    </span>
                  </p>


                  <p className="text-sm">
                    बाकी:
                    <span className="
                      font-semibold
                      text-red-600
                      ml-1
                    ">
                      {formatCurrency(
                        sale.amountRemaining
                      )}
                    </span>
                  </p>

                </div>




                <Badge
                  variant={
                    sale.paymentStatus==="Paid"
                    ? "default"
                    : "destructive"
                  }
                >

                  {
                    sale.paymentStatus==="Paid"
                    ? "पूर्ण भरले"
                    : "बाकी"
                  }

                </Badge>


              </div>



              {
                sale.amountRemaining > 0 && (

                  <div className="flex justify-end">

                    <SendReminderButton
                      customer={sale.customer}
                      phone={sale.phone}
                      amount={sale.amountRemaining}
                    />

                  </div>

                )
              }



            </div>


          ))
        }


        </div>


      </section>






      {/* Payment History */}

      <section className="
        rounded-xl
        border
        p-6
        space-y-5
      ">


        <h2 className="text-xl font-bold">
          पेमेंट इतिहास
        </h2>



        {
          customerPayments.length===0 ? (

            <p className="
              text-muted-foreground
            ">
              अजून पेमेंट नोंद नाही.
            </p>

          ) : (


            <div className="space-y-3">


            {
              customerPayments.map((payment)=>(


                <div
                  key={payment.id}
                  className="
                    flex
                    justify-between
                    items-center
                    border-b
                    pb-3
                  "
                >

                  <div>

                    <p className="font-medium">
                      {payment.paymentMode}
                    </p>


                    <p className="
                      text-sm
                      text-muted-foreground
                    ">
                      {formatDate(payment.date)}
                    </p>


                  </div>



                  <p className="
                    font-bold
                    text-green-600
                  ">
                    {formatCurrency(payment.amount)}
                  </p>


                </div>


              ))
            }


            </div>


          )
        }


      </section>



    </main>

  );
}