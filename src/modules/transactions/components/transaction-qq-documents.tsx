import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Eye, FileText } from "lucide-react";

const documents = [
  {
    id: 1,
    name: "Certificate of Inspection (COI)",
    type: "Certificate",
    date: "2023-10-25",
    status: "Verified",
    size: "2.4 MB",
  },
  {
    id: 2,
    name: "Quality Analysis Report",
    type: "Report",
    date: "2023-10-25",
    status: "Verified",
    size: "1.8 MB",
  },
  {
    id: 3,
    name: "Quantity Certificate",
    type: "Certificate",
    date: "2023-10-25",
    status: "Verified",
    size: "1.2 MB",
  },
];

export function TransactionQQDocuments() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inspection Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    {doc.name}
                  </div>
                </TableCell>
                <TableCell>{doc.type}</TableCell>
                <TableCell>{doc.date}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="border-green-500 bg-green-50 text-green-500 dark:bg-green-900/10"
                  >
                    {doc.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
