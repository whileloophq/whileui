import { useState } from 'react';
import { Modal, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertTitle,
  AspectRatio,
  Avatar,
  AvatarFallback,
  Button,
  ButtonText,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Input,
  Label,
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  type SelectOption,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetHeader,
  Skeleton,
  Spinner,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useToast,
} from '@thewhileloop/whileui';
import { Section } from '../ui';

export function OverlaysTab() {
  const { toast } = useToast();
  const [overlaySheetOpen, setOverlaySheetOpen] = useState(false);
  const [overlaySiblingDeleteOpen, setOverlaySiblingDeleteOpen] = useState(false);
  const [nestedOpen, setNestedOpen] = useState(false);
  const [nestedRegion, setNestedRegion] = useState<SelectOption | undefined>(undefined);
  const [submitFailed, setSubmitFailed] = useState(false);

  return (
    <View>
      <Section title="Feedback" subtitle="Alerts, toasts, skeleton, and spinners">
        <Alert className="flex-row items-start">
          <Text className="text-foreground font-bold text-lg mr-3">💡</Text>
          <View className="flex-1">
            <AlertTitle>Design tokens</AlertTitle>
            <AlertDescription>
              Customize every component by editing global.css — no code changes needed.
            </AlertDescription>
          </View>
        </Alert>
        {submitFailed ? (
          // Appears after an action, so it is announced; the alert above is not.
          <Alert variant="destructive" announce>
            <AlertTitle>Could not save</AlertTitle>
            <AlertDescription>Check your connection and try again.</AlertDescription>
          </Alert>
        ) : null}
        <Button variant="outline" onPress={() => setSubmitFailed((failed) => !failed)}>
          <ButtonText>{submitFailed ? 'Clear the error' : 'Submit with an error'}</ButtonText>
        </Button>
        <View className="flex-row flex-wrap gap-2">
          <Button
            variant="outline"
            onPress={() =>
              toast({
                title: 'Saved successfully',
                description: 'Your changes have been applied.',
              })
            }
          >
            <ButtonText>Toast</ButtonText>
          </Button>
          <Button
            variant="outline"
            onPress={() =>
              toast({
                title: 'Deployed!',
                description: 'Your app is now live.',
                variant: 'success',
              })
            }
          >
            <ButtonText>Success</ButtonText>
          </Button>
          <Button
            variant="destructive"
            onPress={() =>
              toast({
                title: 'Build failed',
                description: 'Check the error logs.',
                variant: 'destructive',
              })
            }
          >
            <ButtonText>Error</ButtonText>
          </Button>
        </View>
        <View className="flex-row gap-4 items-center">
          <Spinner size="sm" />
          <Spinner size="lg" className="text-primary" />
        </View>
        <View className="flex-row items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <View className="gap-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </View>
        </View>
        <View className="flex-row gap-6 mt-4">
          <View className="flex-1">
            <Text className="mb-2 text-xs text-muted-foreground">pulse</Text>
            <Skeleton variant="pulse" className="h-16 w-full rounded-lg" />
          </View>
          <View className="flex-1">
            <Text className="mb-2 text-xs text-muted-foreground">shimmer</Text>
            <Skeleton variant="shimmer" className="h-16 w-full rounded-lg" />
          </View>
        </View>
      </Section>

      <Section title="Overlays" subtitle="Dialogs, popovers, and menus">
        <View className="flex-row flex-wrap gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <ButtonText>Dialog</ButtonText>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>Update your display name and bio.</DialogDescription>
              </DialogHeader>
              <Input placeholder="Display name" className="my-4" />
              <DialogFooter>
                <DialogClose asChild>
                  <Button>
                    <ButtonText>Save</ButtonText>
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <ButtonText>Delete</ButtonText>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete workspace?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove all data. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button variant="outline" onPress={() => setOverlaySheetOpen(true)}>
            <ButtonText>Sheet + native confirm</ButtonText>
          </Button>

          <Modal
            visible={overlaySheetOpen}
            animationType="slide"
            presentationStyle="fullScreen"
            onRequestClose={() => setOverlaySheetOpen(false)}
          >
            {/* `className` does nothing on react-native-safe-area-context's SafeAreaView —
                it is a native view Uniwind does not wrap. Styling goes on a child. */}
            <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
              <View className="flex-1 bg-background p-4">
                <View className="flex-row justify-between items-center mb-6">
                  <Text className="text-lg font-semibold text-foreground">Fullscreen sheet</Text>
                  <Button variant="ghost" onPress={() => setOverlaySheetOpen(false)}>
                    <ButtonText>Close</ButtonText>
                  </Button>
                </View>
                <Text className="text-sm text-muted-foreground mb-4">
                  Sibling AlertDialog uses presentation=&quot;native&quot; so confirm appears above
                  this Modal.
                </Text>
                <Button variant="destructive" onPress={() => setOverlaySiblingDeleteOpen(true)}>
                  <ButtonText>Delete item</ButtonText>
                </Button>
              </View>
            </SafeAreaView>
          </Modal>

          <AlertDialog open={overlaySiblingDeleteOpen} onOpenChange={setOverlaySiblingDeleteOpen}>
            <AlertDialogContent presentation="native">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete item?</AlertDialogTitle>
                <AlertDialogDescription>
                  Uses the system alert so it stacks above the sheet Modal.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onPress={() =>
                    toast({ title: 'Deleted', description: 'Confirmed from native alert.' })
                  }
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* The trigger leaves while the sheet is open, so closing has no element to
              return focus to — the case the overlay contract names. */}
          {!nestedOpen && (
            <Button variant="outline" onPress={() => setNestedOpen(true)}>
              <ButtonText>Nested overlays</ButtonText>
            </Button>
          )}
          <Sheet open={nestedOpen} onOpenChange={setNestedOpen} maxHeight="half">
            <SheetHeader
              title="Nested overlays"
              description="A Select and a confirmation inside one sheet."
            />
            <SheetContent>
              <Select value={nestedRegion} onValueChange={setNestedRegion}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a region" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectItem label="Europe" value="eu" />
                  <SelectItem label="Asia Pacific" value="apac" />
                  <SelectItem label="Americas" value="amer" />
                </SelectContent>
              </Select>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="mt-4 self-start">
                    <ButtonText>Remove region</ButtonText>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Remove region?</DialogTitle>
                    <DialogDescription>
                      Deployments there stop at the end of the month.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">
                        <ButtonText>Keep</ButtonText>
                      </Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button variant="destructive">
                        <ButtonText>Remove</ButtonText>
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </SheetContent>
          </Sheet>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="secondary">
                <ButtonText>Popover</ButtonText>
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Text className="font-medium text-foreground">Layer Settings</Text>
              <Text className="text-sm text-muted-foreground mt-2">
                Adjust opacity, blend mode, and dimensions.
              </Text>
            </PopoverContent>
          </Popover>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">
                <ButtonText>Tooltip</ButtonText>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Long press to preview</TooltipContent>
          </Tooltip>
        </View>

        <View className="flex-row flex-wrap gap-2 mt-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ButtonText>Menu</ButtonText>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Workspace</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onPress={() => toast({ title: 'Settings' })}>
                <Text className="text-foreground">Settings</Text>
              </DropdownMenuItem>
              <DropdownMenuItem onPress={() => toast({ title: 'Members' })}>
                <Text className="text-foreground">Members</Text>
              </DropdownMenuItem>
              <DropdownMenuItem onPress={() => toast({ title: 'Billing' })}>
                <Text className="text-foreground">Billing</Text>
              </DropdownMenuItem>
              <DropdownMenuItem onPress={() => toast({ title: 'API Keys' })}>
                <Text className="text-foreground">API Keys</Text>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ContextMenu>
            <ContextMenuTrigger>
              <View className="border border-dashed border-border p-6 rounded-xl items-center justify-center bg-muted/20">
                <Text className="text-muted-foreground text-sm">Long press for context menu</Text>
              </View>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem>
                <Text className="text-foreground">Copy</Text>
              </ContextMenuItem>
              <ContextMenuItem>
                <Text className="text-foreground">Paste</Text>
              </ContextMenuItem>
              <ContextMenuItem>
                <Text className="text-foreground">Delete</Text>
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </View>
      </Section>

      <OverlayDisclosureDemos />

      <OverlayDataDisplayDemos />
    </View>
  );
}

function OverlayDisclosureDemos() {
  return (
    <Section title="Disclosure" subtitle="Accordions, collapsibles, and tabs">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <Text className="text-foreground font-medium">Is it fully native?</Text>
          </AccordionTrigger>
          <AccordionContent>
            <Text className="text-muted-foreground">
              Yes. Every component renders native Views, Text, and Pressables — no web views.
            </Text>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            <Text className="text-foreground font-medium">Can I customize the theme?</Text>
          </AccordionTrigger>
          <AccordionContent>
            <Text className="text-muted-foreground">
              Yes. All design tokens live in global.css — change one file to redesign everything.
            </Text>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>
            <Text className="text-foreground font-medium">Does it support dark mode?</Text>
          </AccordionTrigger>
          <AccordionContent>
            <Text className="text-muted-foreground">
              Yes. Use the theme toggle above to see every component adapt instantly.
            </Text>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Collapsible className="border border-border rounded-xl p-4 mt-2">
        <View className="flex-row items-center justify-between">
          <Text className="font-semibold text-foreground">What's included</Text>
          <CollapsibleTrigger className="p-2 rounded-lg active:bg-accent">
            <Text className="text-sm font-medium text-primary">Show</Text>
          </CollapsibleTrigger>
        </View>
        <CollapsibleContent className="overflow-hidden">
          <View className="gap-2 mt-3">
            {[
              '34 headless components',
              '31 pre-built blocks',
              'Full theming via design tokens',
            ].map((item) => (
              <View key={item} className="flex-row items-center gap-2 p-2.5 bg-muted rounded-lg">
                <Text className="text-sm text-foreground">{item}</Text>
              </View>
            ))}
          </View>
        </CollapsibleContent>
      </Collapsible>
      <Tabs defaultValue="preview" className="mt-4">
        <TabsList className="w-full">
          <TabsTrigger value="preview">
            <Text className="text-foreground">Preview</Text>
          </TabsTrigger>
          <TabsTrigger value="code">
            <Text className="text-foreground">Code</Text>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Welcome back</CardTitle>
              <CardDescription>Your workspace is ready.</CardDescription>
            </CardHeader>
            <CardContent className="gap-3">
              <Label>Email</Label>
              <Input placeholder="you@company.com" />
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <ButtonText>Continue</ButtonText>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="code">
          <Card>
            <CardContent className="py-6">
              <Text className="text-sm text-muted-foreground font-medium">
                {
                  '<Card>\n  <CardHeader>\n    <CardTitle>Welcome back</CardTitle>\n  </CardHeader>\n  <CardContent>\n    <Input placeholder="..." />\n  </CardContent>\n</Card>'
                }
              </Text>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Section>
  );
}

function OverlayDataDisplayDemos() {
  return (
    <Section title="Data Display" subtitle="Avatars, aspect ratios, and hover cards">
      <View className="flex-row gap-3 items-center">
        {['WU', 'JD', 'MK'].map((initials) => (
          <Avatar key={initials}>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        ))}
        <View className="w-28">
          <AspectRatio ratio={16 / 9}>
            <View className="flex-1 bg-muted rounded-lg items-center justify-center">
              <Text className="text-xs text-muted-foreground">16:9</Text>
            </View>
          </AspectRatio>
        </View>
      </View>
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="link">
            <ButtonText>@whileui (Hover/Press)</ButtonText>
          </Button>
        </HoverCardTrigger>
        <HoverCardContent>
          <View className="flex-row gap-3">
            <Avatar>
              <AvatarFallback>WU</AvatarFallback>
            </Avatar>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-foreground">@whileui</Text>
              <Text className="text-sm text-muted-foreground">
                Beautiful, accessible native components for React Native.
              </Text>
            </View>
          </View>
        </HoverCardContent>
      </HoverCard>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>
            <Text className="text-foreground text-sm">File</Text>
          </MenubarTrigger>
          <MenubarContent>
            <MenubarLabel>Project</MenubarLabel>
            {['New Project', 'Open'].map((item) => (
              <MenubarItem key={item}>
                <Text className="text-foreground">{item}</Text>
              </MenubarItem>
            ))}
            <MenubarSeparator />
            <MenubarItem>
              <Text className="text-foreground">Export</Text>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        {[
          { label: 'Edit', items: ['Undo', 'Redo'] },
          { label: 'View', items: ['Zoom In', 'Zoom Out'] },
        ].map((menu) => (
          <MenubarMenu key={menu.label}>
            <MenubarTrigger>
              <Text className="text-foreground text-sm">{menu.label}</Text>
            </MenubarTrigger>
            <MenubarContent>
              {menu.items.map((item) => (
                <MenubarItem key={item}>
                  <Text className="text-foreground">{item}</Text>
                </MenubarItem>
              ))}
            </MenubarContent>
          </MenubarMenu>
        ))}
      </Menubar>
    </Section>
  );
}
