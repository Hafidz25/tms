import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const FORMAT_DATE = "dd LLLL y";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 40,
  },
  section: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },
  headingSection: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 24,
    height: 120,
    borderBottom: 1.5,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    marginBottom: 30,
  },
  headingText: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 12,
  },
  headingParagraph: {
    fontSize: 12,
  },
  imgLogo: {
    width: 94,
    height: 94,
  },
  contentHeadingSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 36,
  },
  contentHeading: {
    fontSize: 18,
    textDecoration: "underline",
    textAlign: "center",
    fontWeight: "black",
    marginBottom: 8,
  },
  contentSubHeading: {
    fontSize: 14,
    textAlign: "center",
  },
  teamInfoText: {
    fontSize: 12,
  },
  tableText: {
    fontSize: 12,
  },
});

const PayslipPdf = ({
  name,
  position,
  level,
  periodTo,
  periodFrom,
  fee,
  presence,
  transportFee,
  thr,
  other,
  totalFee,
}: any) => {
  const formatCurrency = (number: any) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number);
  };

  const newPeriodTo = format(periodTo, FORMAT_DATE, { locale: id });
  const newPeriodFrom = format(periodFrom, FORMAT_DATE, { locale: id });

  return (
    <Document title={`${name} - Payslip`}>
      <Page size="FOLIO" style={styles.page}>
        <View style={styles.headingSection}>
          <Image src="/payslip/logo.png" style={styles.imgLogo} />
          <View>
            <Text style={styles.headingText}>8AMProject Studio</Text>
            <View style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <Text style={styles.headingParagraph}>
                Jalan Danau Sentani Utara I Blok H3 A5, Madyopuro,
                Kedungkandang,
              </Text>
              <Text style={styles.headingParagraph}>
                Kota Malang Kode Pos 65139
              </Text>
              <Text style={styles.headingParagraph}>
                Email : 8amproject.studio@gmail.com / www.8amproject.com
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.contentHeadingSection}>
          <Text style={styles.contentHeading}>SLIP GAJI KARYAWAN</Text>
          <Text style={styles.contentSubHeading}>
            Periode {newPeriodFrom} - {newPeriodTo}
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            justifyContent: "flex-start",
            gap: 6,
            marginBottom: 28,
          }}
        >
          <Text style={styles.teamInfoText}>
            Nama &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;{name}
          </Text>
          <Text style={styles.teamInfoText}>
            Jabatan &nbsp;&nbsp;&nbsp;: &nbsp;{position}
          </Text>
          <Text style={styles.teamInfoText}>
            Level &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;
            {level}
          </Text>
        </View>
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 14, marginBottom: 4 }}>PENGHASILAN</Text>
          {/* Table row 1 */}
          <View
            style={{
              width: "100%",
              backgroundColor: "#ffc107",
              height: 36,
              border: 2,
              display: "flex",
              flexDirection: "row",
              marginBottom: -1,
            }}
          >
            <View
              style={{
                width: "12%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 34,
                borderRight: 1,
              }}
            >
              <Text style={styles.tableText}>No.</Text>
            </View>
            <View
              style={{
                width: "53%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 34,
                borderRight: 1,
              }}
            >
              <Text style={styles.tableText}>Keterangan</Text>
            </View>
            <View
              style={{
                width: "35%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 34,
              }}
            >
              <Text style={styles.tableText}>Nominal</Text>
            </View>
          </View>
          {/* Table row 2 */}
          <View
            style={{
              width: "100%",
              backgroundColor: "#ffffff",
              height: 36,
              borderLeft: 2,
              borderRight: 2,
              borderBottom: 2,
              display: "flex",
              flexDirection: "row",
              marginBottom: -1,
            }}
          >
            <View
              style={{
                width: "12%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 34,
                borderRight: 1,
              }}
            >
              <Text style={styles.tableText}>1.</Text>
            </View>
            <View
              style={{
                width: "53%",
                display: "flex",
                alignItems: "flex-start",
                paddingHorizontal: 12,
                justifyContent: "center",
                height: 34,
                borderRight: 1,
              }}
            >
              <Text style={styles.tableText}>Gaji Pokok</Text>
            </View>
            <View
              style={{
                width: "35%",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                paddingHorizontal: 12,
                backgroundColor: "#ffe598",
                height: 34,
                borderBottom: 0.5,
              }}
            >
              <Text style={styles.tableText}>{formatCurrency(fee)}</Text>
            </View>
          </View>
          {/* Table row 3 */}
          <View
            style={{
              width: "100%",
              backgroundColor: "#ffffff",
              height: 36,
              borderLeft: 2,
              borderRight: 2,
              borderBottom: 2,
              display: "flex",
              flexDirection: "row",
              marginBottom: -1,
            }}
          >
            <View
              style={{
                width: "12%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 34,
                borderRight: 1,
              }}
            >
              <Text style={styles.tableText}>2.</Text>
            </View>
            <View
              style={{
                width: "53%",
                display: "flex",
                alignItems: "flex-start",
                paddingHorizontal: 12,
                justifyContent: "center",
                height: 34,
                borderRight: 1,
              }}
            >
              <Text style={styles.tableText}>
                Tunjangan Transportasi ({presence})
              </Text>
            </View>
            <View
              style={{
                width: "35%",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                paddingHorizontal: 12,
                backgroundColor: "#ffe598",
                height: 34,
                borderBottom: 0.5,
              }}
            >
              <Text style={styles.tableText}>
                {formatCurrency(transportFee)}
              </Text>
            </View>
          </View>
          {/* Table row 4 */}
          <View
            style={{
              width: "100%",
              backgroundColor: "#ffffff",
              height: 36,
              borderLeft: 2,
              borderRight: 2,
              borderBottom: 2,
              display: "flex",
              flexDirection: "row",
              marginBottom: -1,
            }}
          >
            <View
              style={{
                width: "12%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 34,
                borderRight: 1,
              }}
            >
              <Text style={styles.tableText}>3.</Text>
            </View>
            <View
              style={{
                width: "53%",
                display: "flex",
                alignItems: "flex-start",
                paddingHorizontal: 12,
                justifyContent: "center",
                height: 34,
                borderRight: 1,
              }}
            >
              <Text style={styles.tableText}>THR</Text>
            </View>
            <View
              style={{
                width: "35%",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                paddingHorizontal: 12,
                backgroundColor: "#ffe598",
                height: 34,
                borderBottom: 0.5,
              }}
            >
              <Text style={styles.tableText}>{formatCurrency(thr)}</Text>
            </View>
          </View>
          {/* Table row 5 */}
          <View
            style={{
              width: "100%",
              backgroundColor: "#ffffff",
              height: 36,
              borderLeft: 2,
              borderRight: 2,
              borderBottom: 2,
              display: "flex",
              flexDirection: "row",
              marginBottom: -1,
            }}
          >
            <View
              style={{
                width: "12%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 34,
                borderRight: 1,
              }}
            >
              <Text style={styles.tableText}>4.</Text>
            </View>
            <View
              style={{
                width: "53%",
                display: "flex",
                alignItems: "flex-start",
                paddingHorizontal: 12,
                justifyContent: "center",
                height: 34,
                borderRight: 1,
              }}
            >
              <Text style={styles.tableText}>Lain - Lain</Text>
            </View>
            <View
              style={{
                width: "35%",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                paddingHorizontal: 12,
                backgroundColor: "#ffe598",
                height: 34,
                borderBottom: 0.5,
              }}
            >
              <Text style={styles.tableText}>{formatCurrency(other)}</Text>
            </View>
          </View>
          {/* Table row 6 */}
          <View
            style={{
              width: "100%",
              backgroundColor: "#ffffff",
              height: 36,
              borderLeft: 2,
              borderRight: 2,
              borderBottom: 2,
              display: "flex",
              flexDirection: "row",
              marginBottom: -1,
            }}
          >
            <View
              style={{
                width: "65%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 34,
                borderRight: 1,
              }}
            >
              <Text style={styles.tableText}>TOTAL</Text>
            </View>
            <View
              style={{
                width: "35%",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                paddingHorizontal: 12,
                backgroundColor: "#ffe598",
                height: 34,
                borderBottom: 0.5,
              }}
            >
              <Text style={styles.tableText}>{formatCurrency(totalFee)}</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            marginBottom: 28,
          }}
        >
          <Text style={styles.tableText}>Keterangan :</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 6,
              alignItems: "flex-start",
              marginLeft: 12,
            }}
          >
            <Text style={styles.tableText}>1.</Text>
            <Text style={styles.tableText}>
              THR untuk &gt; 1 Tahun, Senilai 1 Kali Gaji Pokok
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 6,
              alignItems: "flex-start",
              marginLeft: 12,
            }}
          >
            <Text style={styles.tableText}>2.</Text>
            <Text style={styles.tableText}>
              Gaji Dibayarkan setiap Tanggal 1-3 bulan berikutnya
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 6,
              alignItems: "flex-start",
              marginLeft: 12,
            }}
          >
            <Text style={styles.tableText}>3.</Text>
            <Text style={styles.tableText}>
              Apabila terjadi kesalahan perhitungan laporkan sebelum tgl 1
              setiap bulannya
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 6,
              alignItems: "flex-start",
              marginLeft: 12,
            }}
          >
            <Text style={styles.tableText}>4.</Text>
            <Text style={styles.tableText}>
              Kenaikan Level akan ditentukan setelah masa Kontrak 1 tahun. Level
              akan Direview setiap tahunnya sesuai dengan performa dan
              diinformasikan ke masing-masing team
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "flex-end",
          }}
        >
          <Text style={styles.tableText}>
            Malang, {format(Date.now(), FORMAT_DATE, { locale: id })}
          </Text>
          <Image src="/payslip/signature.jpg" style={{ width: 50 }} />
          <Text style={styles.tableText}>Robi Wahyudi</Text>
          <Text style={styles.tableText}>8AMProject Studio</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PayslipPdf;
