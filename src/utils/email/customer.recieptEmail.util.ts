export function recieptEmailTemplate(id: string, guest: string, name: string, checkIn: string, checkOut: string, hotelName: string, hotelPhone: string, clientPhone: string, totalPrice: number): string {
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
      font-family: Arial, sans-serif;
    }

    .container {
      width: 100%;
      padding: 20px;
    }

    .card {
      max-width: 600px;
      background: #ffffff;
      border-radius: 10px;
      padding: 20px;
      margin: auto;
    }

    .title {
      font-size: 22px;
      font-weight: bold;
      color: #333;
      margin-bottom: 20px;
    }

    .label {
      color: #888;
      font-size: 12px;
    }

    .value {
      font-size: 16px;
      padding-bottom: 10px;
    }

    .row {
      width: 100%;
    }

    .left {
      text-align: left;
    }

    .right {
      text-align: right;
    }

    .divider {
      border-top: 1px solid #eee;
      margin: 20px 0;
    }

    .badge {
      display: inline-block;
      margin-top: 5px;
      padding: 6px 12px;
      background: #d4f5dd;
      color: #2e7d32;
      border-radius: 20px;
      font-size: 12px;
    }

    .price {
      font-size: 28px;
      font-weight: bold;
      color: #2e7d32;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    td {
      vertical-align: top;
    }
    .footer {
        margin-top: 20px;
        text-align: center;
        font-size: 0.9em;
        color: #888888;
    }
  </style>

</head>

<body>

  <table class="container">
    <tr>
      <td>
        <table class="card">
          
          <tr>
            <td class="title">Reservation Summary</td>
          </tr>

          <!-- Row 1 -->
          <tr>
            <td>
              <table class="row">
                <tr>
                  <td class="label left">RESERVATION ID</td>
                  <td class="label right">GUESTS</td>
                </tr>
                <tr>
                  <td class="value left">${id}</td>
                  <td class="value right">${guest}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Row 2 -->
          <tr>
            <td>
              <table class="row">
                <tr>
                  <td class="label left">GUEST NAME</td>
                  <td class="label right">CHECK-IN</td>
                </tr>
                <tr>
                  <td class="value left">${name}</td>
                  <td class="value right">${checkIn}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Row 3 -->
          <tr>
            <td>
              <table class="row">
                <tr>
                  <td class="label left">RECEIVING HOTEL</td>
                  <td class="label right">CHECK-OUT</td>
                </tr>
                <tr>
                  <td class="value left">${hotelName}</td>
                  <td class="value right">${checkOut}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Row 4 -->
          <tr>
            <td>
              <table class="row">
                <tr>
                  <td class="label left">HOTEL PHONE</td>
                  <td class="label right">CLIENT PHONE</td>
                </tr>
                <tr>
                  <td class="value left">${hotelPhone}</td>
                  <td class="value right">${clientPhone}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td><div class="divider"></div></td>
          </tr>

          <!-- Footer -->
          <tr>
            <td>
              <table>
                <tr>
                  <td>
                    <div class="label">Payment Status</div>
                    <div class="badge">To be Paid at receiving hotel</div>
                  </td>
                  <td class="right">
                    <div class="label">Price</div>
                    <div class="price">$${totalPrice}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
  <div class="footer">
        Best regards,<br>
        <span class="highlight">Rebook Team</span>
    </div>

</body>
</html>`
}